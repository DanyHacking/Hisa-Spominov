#!/usr/bin/env python3
"""
Generate PDF for "Hiša spominov – Ko dnevniki spregovorijo"
With complete table of contents: 76 chapters, ~310 pages
"""

from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from reportlab.lib.colors import HexColor

BOOK_TITLE = "Hiša spominov"
BOOK_SUBTITLE = "Ko dnevniki spregovorijo"
AUTHOR = "Danijel Cvijetić"

TEXT_COLOR = "#2C2C2C"
ACCENT_COLOR = "#8B4513"

PAGE_WIDTH = 6 * inch
PAGE_HEIGHT = 9 * inch
MARGIN = 0.75 * inch


def get_chapters():
    """Complete table of contents with page numbers"""
    chapters = [
        # Predgovor
        ('Predgovor', 1),
        ('Zakaj ta zgodba obstoja', 7),
        ('Spomini kot temelj identitete', 9),
        ('Kako so bili dnevniki najdeni', 11),
        ('Bralec kot soudeleženec zgodbe', 14),
        
        # I. DEL — HIŠA
        ('I. DEL — HIŠA', 19),
        ('Stara hiša na robu mesta', 19),
        ('Vonj prahu in pozabe', 22),
        ('Hodnik tišine', 26),
        ('Sobe brez življenja', 29),
        ('Podstrešje', 33),
        ('Škatla z dnevniki', 37),
        ('Odločitev, da jih vzamem', 41),
        ('Pogovor z ženo', 44),
        ('Prva stran', 48),
        
        # II. DEL — MATI
        ('II. DEL — MATI', 53),
        ('Prvi zapis', 53),
        ('Začetek ljubezni', 56),
        ('Prvi znaki tišine', 60),
        ('Njegove oči', 63),
        ('Drobne spremembe', 67),
        ('Materina ljubezen do najstarejšega sina', 71),
        ('Materina ljubezen do srednjega sina', 75),
        ('Materina ljubezen do hčere', 78),
        ('Dnevi, ko je še verjela', 82),
        ('Prva senca dvoma', 86),
        ('Tišina za mizo', 90),
        ('Strah pred izgubo bližine', 94),
        ('Spomini na začetek', 98),
        
        # III. DEL — OČE
        ('III. DEL — OČE', 105),
        ('Dnevnik očeta', 105),
        ('Moški, ki ne zna govoriti', 108),
        ('Teža odgovornosti', 112),
        ('Jeza kot obramba', 116),
        ('Njegova utrujenost', 119),
        ('Strah za otroke', 123),
        ('Konflikt z najstarejšim sinom', 127),
        ('Noč obžalovanja', 131),
        ('Tišina v avtu', 135),
        ('Razmišljanje o življenju', 138),
        
        # IV. DEL — OTROCI (Najstarejši sin)
        ('IV. DEL — OTROCI', 145),
        ('Najstarejši sin', 145),
        ('Prvi zapis', 145),
        ('Prezgodnja odgovornost', 148),
        ('Varuh bratov in sestre', 152),
        ('Poslušanje prepira', 155),
        ('Občutek krivde', 159),
        ('Strah, da postane kot oče', 163),
        
        # Srednji sin
        ('Srednji sin', 169),
        ('Svet domišljije', 169),
        ('Zgodbe kot pobeg', 173),
        ('Zgodba o izgubljenih starših', 177),
        ('Park in tišina', 181),
        
        # Najmlajša hči
        ('Najmlajša hči', 187),
        ('Risba družine', 187),
        ('Sonce brez nasmehov', 190),
        ('Skrita pod mizo', 194),
        ('Najlepši dan', 198),
        ('Sanje o pikniku', 202),
        
        # V. DEL — TEMNI ODTENKI
        ('V. DEL — TEMNI ODTENKI', 209),
        ('Noč prepira', 209),
        ('Materin zapis o tisti noči', 212),
        ('Očetov zapis o isti noči', 216),
        ('Najstarejši sin kot priča', 220),
        ('Tišina po viharju', 224),
        ('Razpoke v odnosu', 228),
        ('Materina utrujenost', 232),
        ('Očetov občutek neuspeha', 236),
        
        # VI. DEL — MEJA
        ('VI. DEL — MEJA', 241),
        ('Materin notranji boj', 241),
        ('Občutek izgubljene identitete', 245),
        ('Razmišljanje o odhodu', 248),
        ('Ljubezen do otrok kot sidro', 252),
        
        # VII. DEL — PRVI PREOBRAT
        ('VII. DEL — PRVI PREOBRAT', 259),
        ('Očetov poskus povezovanja', 259),
        ('Besede sinu', 262),
        ('Majhen premik', 265),
        
        # VIII. DEL — NAJU Z ŽENO
        ('VIII. DEL — NAJU Z ŽENO', 271),
        ('Refleksija ob branju', 271),
        ('Ženin čustveni zlom', 275),
        ('Pogovor, ki ga nisva nikoli imela', 279),
        ('Počasi nazaj drug k drugemu', 283),
        
        # IX. DEL — HIŠA SPOMINOV
        ('IX. DEL — HIŠA SPOMINOV', 289),
        ('Kaj so nas naučili dnevniki', 289),
        ('Pomen drobnih trenutkov', 293),
        ('Ljubezen kot odločitev', 297),
        
        # EPILOG
        ('EPILOG', 301),
        ('Hiša še vedno stoji', 301),
        ('Sporočilo bralcem', 305),
        ('Ljubite zdaj', 305),
        
        # ZAHVALE
        ('Zahvale', 309),
        ('Hvala', 309),
    ]
    return chapters


def create_pdf():
    """Create PDF with empty pages for each chapter"""
    
    chapters = get_chapters()
    print(f"Creating PDF with {len(chapters)} chapters...")
    
    doc = SimpleDocTemplate(
        "pdf/hisa_spominov_poln.pdf",
        pagesize=(PAGE_WIDTH, PAGE_HEIGHT),
        leftMargin=MARGIN,
        rightMargin=MARGIN,
        topMargin=MARGIN,
        bottomMargin=MARGIN
    )
    
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Title'],
        fontName='Times-Bold',
        fontSize=28,
        textColor=HexColor(ACCENT_COLOR),
        spaceAfter=30,
        alignment=TA_CENTER
    )
    
    subtitle_style = ParagraphStyle(
        'CustomSubtitle',
        parent=styles['Normal'],
        fontName='Times-Italic',
        fontSize=16,
        textColor=HexColor(TEXT_COLOR),
        spaceAfter=50,
        alignment=TA_CENTER
    )
    
    chapter_title_style = ParagraphStyle(
        'ChapterTitle',
        parent=styles['Heading1'],
        fontName='Times-Bold',
        fontSize=18,
        textColor=HexColor(ACCENT_COLOR),
        spaceAfter=20,
        spaceBefore=30,
        alignment=TA_CENTER
    )
    
    part_title_style = ParagraphStyle(
        'PartTitle',
        parent=styles['Heading1'],
        fontName='Times-Bold',
        fontSize=22,
        textColor=HexColor(ACCENT_COLOR),
        spaceAfter=40,
        spaceBefore=40,
        alignment=TA_CENTER
    )
    
    page_number_style = ParagraphStyle(
        'PageNumber',
        parent=styles['Normal'],
        fontName='Times-Roman',
        fontSize=10,
        textColor=HexColor('#888888'),
        alignment=TA_CENTER
    )
    
    content = []
    
    # Title page
    content.append(Paragraph(BOOK_TITLE, title_style))
    content.append(Paragraph(BOOK_SUBTITLE, subtitle_style))
    content.append(Paragraph(AUTHOR, page_number_style))
    content.append(PageBreak())
    
    # Generate pages for each chapter
    current_page = 2
    
    for title, target_page in chapters:
        # Fill pages until target
        while current_page < target_page:
            content.append(PageBreak())
            content.append(Paragraph(f"Stran {current_page}", page_number_style))
            current_page += 1
        
        # Chapter title
        if title.startswith('I. DEL') or title.startswith('II. DEL') or \
           title.startswith('III. DEL') or title.startswith('IV. DEL') or \
           title.startswith('V. DEL') or title.startswith('VI. DEL') or \
           title.startswith('VII. DEL') or title.startswith('VIII. DEL') or \
           title.startswith('IX. DEL') or title == 'EPILOG' or title == 'Zahvale':
            content.append(Paragraph(title, part_title_style))
        else:
            content.append(Paragraph(title, chapter_title_style))
        
        # Placeholder content
        content.append(Spacer(1, 0.2*inch))
        
        # Small placeholder text
        content.append(Paragraph(
            f"<i>Vsebina poglavja '{title}' bo dodana kasneje.</i>",
            styles['Normal']
        ))
        
        content.append(PageBreak())
        current_page += 1
    
    # Build PDF
    doc.build(content)
    print(f"PDF created successfully with ~{current_page} pages")


if __name__ == "__main__":
    create_pdf()
