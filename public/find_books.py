import json
import subprocess

# The list of books to add (with categories)
add_list_raw = """David Allen — Getting Things Done - productivity
Stephen Covey — The 7 Habits of Highly Effective People - productivity
James Clear — Atomic Habits - productivity
Peter Drucker — The Effective Executive - productivity
Oliver Burkeman — Four Thousand Weeks: Time Management for Mortals - productivity
Daniel Lieberman — The Story of the Human Body: Evolution, Health, and Disease - health
Siddhartha Mukherjee — The Gene: An Intimate History - health
Ed Yong — I Contain Multitudes - health
John Ratey — Spark: The Revolutionary New Science of Exercise and the Brain - health
Benjamin Graham — The Intelligent Investor - finances
Nassim Nicholas Taleb — Fooled by Randomness - finances
Nassim Nicholas Taleb — The Black Swan - finances
Morgan Housel — The Psychology of Money - finances
Yuval Noah Harari — Sapiens: A Brief History of Humankind - history
Jared Diamond — Collapse: How Societies Choose to Fail or Succeed - history
Francis Fukuyama — The End of History and the Last Man - history
Peter Frankopan — The Silk Roads: A New History of the World - history
Will & Ariel Durant — The Lessons of History - history
John Maynard Keynes — The General Theory of Employment, Interest and Money - economy
Joseph Schumpeter — Capitalism, Socialism, and Democracy - economy
Karl Marx — Capital - economy
Ludwig von Mises — Human Action - economy
Eliyahu M. Goldratt — The Goal: A Process of Ongoing Improvement - business
W. Edwards Deming — Out of the Crisis - business
Alfred P. Sloan — My Years with General Motors - business
Michael E. Gerber — The E-Myth Revisited - business
Peter M. Senge — The Fifth Discipline - business
Plato — The Republic - philosophy
Immanuel Kant — Critique of Pure Reason - philosophy
Friedrich Nietzsche — Beyond Good and Evil - philosophy
John Rawls — A Theory of Justice - philosophy
Bertrand Russell — A History of Western Philosophy - philosophy
Byron Sharp — How Brands Grow: What Marketers Don't Know - marketing
Claude Hopkins — Scientific Advertising - marketing
Les Binet & Peter Field — The Long and the Short of It - marketing
Niccolò Machiavelli — The Prince - politics
Thomas Hobbes — Leviathan - politics
Alexis de Tocqueville — Democracy in America - politics
Hannah Arendt — The Origins of Totalitarianism - politics
Bruce Bueno de Mesquita, Alastair Smith — The Dictator's Handbook - politics
Richard Feynman, Robert Leighton, Matthew Sands — The Feynman Lectures on Physics - math-physics
Stephen Hawking — A Brief History of Time - math-physics
Roger Penrose — The Road to Reality - math-physics
G.H. Hardy — A Mathematician's Apology - math-physics
Norbert Wiener — Cybernetics: Or Control and Communication in the Animal and the Machine - technology
Walter Isaacson — The Innovators - technology
Kevin Kelly — What Technology Wants - technology
Andrew Hunt, David Thomas — The Pragmatic Programmer - technology
Hugo Mercier, Dan Sperber — The Enigma of Reason - human-behavior
Lee Ross, Richard Nisbett — The Person and the Situation - human-behavior
David Buss — Evolutionary Psychology: The New Science of the Mind - human-behavior
Carol Dweck — Mindset: The New Psychology of Success - human-behavior"""

def parse_list(raw):
    books = []
    for line in raw.strip().split('\n'):
        if ' — ' in line and ' - ' in line:
            author_title, cat = line.rsplit(' - ', 1)
            author, title = author_title.split(' — ', 1)
            books.append({
                "author": author.strip(),
                "title": title.strip(),
                "category": cat.strip()
            })
    return books

to_add = parse_list(add_list_raw)

# Get original allbooks.json from git
try:
    original_json_str = subprocess.check_output(['git', 'show', 'HEAD:public/allbooks.json'], encoding='utf-8')
    all_books = json.loads(original_json_str)
except Exception as e:
    print(f"Error reading original file: {e}")
    # Fallback to current file if git fails (unlikely here)
    with open('allbooks.json', 'r', encoding='utf-8') as f:
        all_books = json.load(f)

found_books = []
missing_books = []

for entry in to_add:
    target_title = entry['title'].lower()
    target_author = entry['author'].lower()
    
    # Try exact match or starts with
    match = None
    for b in all_books:
        file_title = b.get('title', '').lower()
        file_author = b.get('author', '').lower()
        
        # Check if title matches or is contained
        title_match = target_title in file_title or file_title in target_title
        # Check if author matches partially (first 5 chars of last name or similar)
        author_parts = target_author.split()
        last_name = author_parts[-1] if author_parts else ""
        author_match = last_name in file_author or target_author in file_author
        
        if title_match and author_match:
            match = b.copy()
            break
    
    if match:
        # Update category
        match['categories'] = [entry['category']]
        found_books.append(match)
        print(f"FOUND: {match['title']} by {match['author']}")
    else:
        missing_books.append(entry)

print(f"Found in original file: {len(found_books)}")
print(f"Missing (need to parse): {len(missing_books)}")

for mb in missing_books:
    print(f"MISSING: {mb['author']} - {mb['title']}")

# For debugging, let's see some found titles
# print("\nSample found titles:")
# for fb in found_books[:5]:
#     print(f"- {fb['title']}")
