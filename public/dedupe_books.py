import json

titles_to_dedupe = [
    'The Story of the Human Body: Evolution, Health, and Disease',
    'The Gene: An Intimate History',
    'I Contain Multitudes: The Microbes Within Us and a Grander View of Life',
    'Collapse: How Societies Choose to Fail or Succeed'
]

with open('allbooks.json', 'r', encoding='utf-8') as f:
    books = json.load(f)

new_books = []
seen = set()
removed_count = 0

for b in books:
    title = b.get('title', '')
    if title in titles_to_dedupe:
        if title in seen:
            removed_count += 1
            continue
        seen.add(title)
    new_books.append(b)

with open('allbooks.json', 'w', encoding='utf-8') as f:
    json.dump(new_books, f, ensure_ascii=False, indent=2)

print(f"Removed {removed_count} duplicates.")
print(f"Final count: {len(new_books)}")
