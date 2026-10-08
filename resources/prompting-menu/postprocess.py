"""Add visible PDF page numbers as pagination artifacts and repair bookmark titles.

Chrome produces the tagged document. This small final pass appends only the page
number drawing command, wrapped in an /Artifact marked-content sequence so it is
visible to print readers but skipped by assistive technology.

Bookmark titles are replaced with the real heading text collected by render.mjs
(argv[2]), because Chrome drops the space wherever a heading wraps. Each
replacement must match Chrome's title once whitespace is ignored, so a heading
can never be attached to the wrong bookmark.
"""
import json
from pathlib import Path
import re
import sys

from pypdf import PdfReader, PdfWriter
from pypdf.generic import (
    ArrayObject,
    DecodedStreamObject,
    DictionaryObject,
    NameObject,
    NumberObject,
    TextStringObject,
)


pdf_path = Path(sys.argv[1]).resolve()
tmp_path = pdf_path.with_suffix('.numbered.tmp.pdf')
reader = PdfReader(str(pdf_path))
writer = PdfWriter(clone_from=str(pdf_path))

font = DictionaryObject({
    NameObject('/Type'): NameObject('/Font'),
    NameObject('/Subtype'): NameObject('/Type1'),
    NameObject('/BaseFont'): NameObject('/Helvetica-Bold'),
    NameObject('/Encoding'): NameObject('/WinAnsiEncoding'),
})
font_ref = writer._add_object(font)

for index, page in enumerate(writer.pages):
    if index == 0:  # no number on the cover
        continue
    resources = page.get('/Resources')
    resources = resources.get_object() if hasattr(resources, 'get_object') else resources
    if resources is None:
        resources = DictionaryObject()
        page[NameObject('/Resources')] = resources
    fonts = resources.get('/Font')
    fonts = fonts.get_object() if hasattr(fonts, 'get_object') else fonts
    if fonts is None:
        fonts = DictionaryObject()
        resources[NameObject('/Font')] = fonts
    fonts[NameObject('/PromptSmashPageNumber')] = font_ref

    width = float(page.mediabox.width)
    x = 35 if (index + 1) % 2 == 0 else width - 42
    number = index + 1
    commands = (
        'Q\n'
        '/Artifact <</Type /Pagination /Subtype /PageNum>> BDC\n'
        'BT\n'
        '/PromptSmashPageNumber 8 Tf\n'
        '0.169 0.106 0.078 rg\n'
        f'1 0 0 1 {x:.2f} 22 Tm\n'
        f'({number}) Tj\n'
        'ET\n'
        'EMC\n'
    ).encode('ascii')
    prefix = DecodedStreamObject()
    prefix.set_data(b'q\n')
    prefix_ref = writer._add_object(prefix)
    stream = DecodedStreamObject()
    stream.set_data(commands)
    stream_ref = writer._add_object(stream)
    current = page.get('/Contents')
    if isinstance(current, ArrayObject):
        page[NameObject('/Contents')] = ArrayObject([prefix_ref, *current, stream_ref])
    elif current is None:
        page[NameObject('/Contents')] = stream_ref
    else:
        page[NameObject('/Contents')] = ArrayObject([prefix_ref, current, stream_ref])

# Decimal page labels from the cover onward; PDF viewers may expose these.
writer._root_object[NameObject('/PageLabels')] = DictionaryObject({
    NameObject('/Nums'): ArrayObject([
        NumberObject(0),
        DictionaryObject({NameObject('/S'): NameObject('/D')}),
    ])
})

# Bookmarks: depth-first order of the outline is the document order of the headings.
headings = json.loads(Path(sys.argv[2]).read_text(encoding='utf-8'))
items = []
def collect(node):
    while node is not None:
        node = node.get_object()
        items.append(node)
        collect(node.get('/First'))
        node = node.get('/Next')
outlines = writer._root_object.get('/Outlines')
if outlines is not None:
    collect(outlines.get_object().get('/First'))
if len(items) != len(headings):
    sys.exit(f'Bookmark count {len(items)} does not match heading count {len(headings)}')
squash = lambda text: re.sub(r'\s+', '', text)
repaired = 0
for item, heading in zip(items, headings):
    title = str(item['/Title'])
    if squash(title) != squash(heading):
        sys.exit(f'Bookmark {title!r} does not match heading {heading!r}')
    if title != heading:
        item[NameObject('/Title')] = TextStringObject(heading)
        repaired += 1

with tmp_path.open('wb') as handle:
    writer.write(handle)
tmp_path.replace(pdf_path)
print(f'Added {len(writer.pages) - 1} artifact-tagged page numbers')
print(f'Checked {len(items)} bookmarks; repaired {repaired} titles')
