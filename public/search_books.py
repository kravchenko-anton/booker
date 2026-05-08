import json
import re

books_to_find = [
    ("David Allen", "Getting Things Done", "productivity"),
    ("Stephen Covey", "The 7 Habits of Highly Effective People", "productivity"),
    ("James Clear", "Atomic Habits", "productivity"),
    ("Oliver Burkeman", "Four Thousand Weeks: Time Management for Mortals", "productivity"),
    ("John Ratey", "Spark: The Revolutionary New Science of Exercise and the Brain", "health"),
    ("Benjamin Graham", "The Intelligent Investor", "finances"),
    ("Morgan Housel", "The Psychology of Money", "finances"),
    ("Yuval Noah Harari", "Sapiens: A Brief History of Humankind", "history"),
    ("Peter Frankopan", "The Silk Roads: A New History of the World", "history"),
    ("Will & Ariel Durant", "The Lessons of History", "history"),
    ("John Maynard Keynes", "The General Theory of Employment, Interest and Money", "economy"),
    ("Joseph Schumpeter", "Capitalism, Socialism, and Democracy", "economy"),
    ("Karl Marx", "Capital", "economy"),
    ("Ludwig von Mises", "Human Action", "economy"),
    ("Eliyahu M. Goldratt", "The Goal: A Process of Ongoing Improvement", "business"),
    ("W. Edwards Deming", "Out of the Crisis", "business"),
    ("Alfred P. Sloan", "My Years with General Motors", "business"),
    ("Michael E. Gerber", "The E-Myth Revisited", "business"),
    ("Peter M. Senge", "The Fifth Discipline", "business"),
    ("Plato", "The Republic", "philosophy"),
    ("Immanuel Kant", "Critique of Pure Reason", "philosophy"),
    ("Friedrich Nietzsche", "Beyond Good and Evil", "philosophy"),
    ("John Rawls", "A Theory of Justice", "philosophy"),
    ("Bertrand Russell", "A History of Western Philosophy", "philosophy"),
    ("Byron Sharp", "How Brands Grow: What Marketers Don't Know", "marketing"),
    ("Claude Hopkins", "Scientific Advertising", "marketing"),
    ("Les Binet & Peter Field", "The Long and the Short of It", "marketing"),
    ("Niccolò Machiavelli", "The Prince", "politics"),
    ("Thomas Hobbes", "Leviathan", "politics"),
    ("Alexis de Tocqueville", "Democracy in America", "politics"),
    ("Hannah Arendt", "The Origins of Totalitarianism", "politics"),
    ("Bruce Bueno de Mesquita, Alastair Smith", "The Dictator's Handbook", "politics"),
    ("Richard Feynman, Robert Leighton, Matthew Sands", "The Feynman Lectures on Physics", "math-physics"),
    ("Stephen Hawking", "A Brief History of Time", "math-physics"),
    ("Roger Penrose", "The Road to Reality", "math-physics"),
    ("G.H. Hardy", "A Mathematician's Apology", "math-physics"),
    ("Norbert Wiener", "Cybernetics: Or Control and Communication in the Animal and the Machine", "technology"),
    ("Walter Isaacson", "The Innovators", "technology"),
    ("Kevin Kelly", "What Technology Wants", "technology"),
    ("Andrew Hunt, David Thomas", "The Pragmatic Programmer", "technology"),
    ("Hugo Mercier, Dan Sperber", "The Enigma of Reason", "human-behavior"),
    ("Lee Ross, Richard Nisbett", "The Person and the Situation", "human-behavior"),
    ("David Buss", "Evolutionary Psychology: The New Science of the Mind", "human-behavior"),
    ("Carol Dweck", "Mindset: The New Psychology of Success", "human-behavior")
]

with open('allbooks.json', 'r', encoding='utf-8') as f:
    all_books = json.load(f)

found = []
missing = []

for author, title, category in books_to_find:
    match = None
    target_title = title.lower()
    target_author = author.lower()
    
    for b in all_books:
        b_title = b.get('title', '').lower()
        b_author = b.get('author', '').lower()
        
        # Exact match or title contains target_title or vice versa
        if (target_title in b_title or b_title in target_title) and (target_author in b_author or b_author in target_author):
            match = b.copy()
            break
            
    if match:
        match['categories'] = [category]
        found.append(match)
    else:
        missing.append((author, title, category))

print(json.dumps({"found": found, "missing": missing}, ensure_ascii=False, indent=2))
