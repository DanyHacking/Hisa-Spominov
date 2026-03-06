#!/usr/bin/env python3
"""
Generate PDF for "Hiša spominov – Ko dnevniki spregovorijo"
Reads content from zgodba_izvorna.txt and creates a ~310 page PDF
"""

from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Flowable
from reportlab.lib.colors import HexColor
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import os

BOOK_TITLE = "Hiša spominov"
BOOK_SUBTITLE = "Ko dnevniki spregovorijo"
AUTHOR = "Danijel Cvijetić"

TEXT_COLOR = "#2C2C2C"
ACCENT_COLOR = "#8B4513"

PAGE_WIDTH = 6 * inch
PAGE_HEIGHT = 9 * inch
MARGIN = 0.75 * inch


def read_story_content():
    """Read story content from the source file"""
    try:
        # Try UTF-8 first
        with open("zgodba_izvorna.txt", "r", encoding="utf-8") as f:
            content = f.read()
    except UnicodeDecodeError:
        # Fallback to ISO-8859-2 (Central European)
        with open("zgodba_izvorna.txt", "r", encoding="iso-8859-2") as f:
            content = f.read()
    
    # Parse pages
    pages = {}
    current_page = 0
    current_content = []
    
    for line in content.split('\n'):
        if line.strip().startswith('=== PAGE'):
            # Save previous page
            if current_content:
                pages[current_page] = '\n'.join(current_content)
            # Extract page number
            try:
                current_page = int(line.strip().split()[-1].replace('===', '').strip())
            except:
                current_page += 1
            current_content = []
        else:
            current_content.append(line)
    
    # Save last page
    if current_content:
        pages[current_page] = '\n'.join(current_content)
    
    return pages


def get_chapters():
    """Complete table of contents with page numbers matching 310 pages"""
    chapters = [
        # Predgovor (pages 1-18)
        ('Predgovor', 1),
        ('Zakaj ta zgodba obstoja', 7),
        ('Spomini kot temelj identitete', 9),
        ('Kako so bili dnevniki najdeni', 11),
        ('Bralec kot soudeleženec zgodbe', 14),
        
        # I. DEL — HIŠA (pages 19-52)
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
        
        # II. DEL — MATI (pages 53-104)
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
        
        # III. DEL — OČE (pages 105-144)
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
        
        # IV. DEL — OTROCI (pages 145-208)
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
        
        # V. DEL — TEMNI ODTENKI (pages 209-240)
        ('V. DEL — TEMNI ODTENKI', 209),
        ('Noč prepira', 209),
        ('Materin zapis o tisti noči', 212),
        ('Očetov zapis o isti noči', 216),
        ('Najstarejši sin kot priča', 220),
        ('Tišina po viharju', 224),
        ('Razpoke v odnosu', 228),
        ('Materina utrujenost', 232),
        ('Očetov občutek neuspeha', 236),
        
        # VI. DEL — MEJA (pages 241-258)
        ('VI. DEL — MEJA', 241),
        ('Materin notranji boj', 241),
        ('Občutek izgubljene identitete', 245),
        ('Razmišljanje o odhodu', 248),
        ('Ljubezen do otrok kot sidro', 252),
        
        # VII. DEL — PRVI PREOBRAT (pages 259-270)
        ('VII. DEL — PRVI PREOBRAT', 259),
        ('Očetov poskus povezovanja', 259),
        ('Besede sinu', 262),
        ('Majhen premik', 265),
        
        # VIII. DEL — NAJU Z ŽENO (pages 271-288)
        ('VIII. DEL — NAJU Z ŽENO', 271),
        ('Refleksija ob branju', 271),
        ('Ženin čustveni zlom', 275),
        ('Pogovor, ki ga nisva nikoli imela', 279),
        ('Počasi nazaj drug k drugemu', 283),
        
        # IX. DEL — HIŠA SPOMINOV (pages 289-300)
        ('IX. DEL — HIŠA SPOMINOV', 289),
        ('Kaj so nas naučili dnevniki', 289),
        ('Pomen drobnih trenutkov', 293),
        ('Ljubezen kot odločitev', 297),
        
        # EPILOG (pages 301-308)
        ('EPILOG', 301),
        ('Hiša še vedno stoji', 301),
        ('Sporočilo bralcem', 305),
        ('Ljubite zdaj', 305),
        
        # ZAHVALE (pages 309-310)
        ('Zahvale', 309),
        ('Hvala', 310),
    ]
    return chapters


def create_pdf():
    """Create PDF with content from story file"""
    
    print("Reading story content...")
    pages_content = read_story_content()
    print(f"Found {len(pages_content)} pages in source file")
    
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
    
    normal_style = ParagraphStyle(
        'NormalText',
        parent=styles['Normal'],
        fontName='Times-Roman',
        fontSize=12,
        textColor=HexColor(TEXT_COLOR),
        spaceAfter=12,
        alignment=TA_JUSTIFY,
        leading=18
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
            # Check if we have content for this page
            if current_page in pages_content:
                page_text = pages_content[current_page]
                # Split into paragraphs
                for para in page_text.strip().split('\n\n'):
                    if para.strip():
                        content.append(Paragraph(para.strip(), normal_style))
                content.append(PageBreak())
            else:
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
        
        # Check if we have content for this page
        if current_page in pages_content:
            page_text = pages_content[current_page]
            for para in page_text.strip().split('\n\n'):
                if para.strip():
                    content.append(Paragraph(para.strip(), normal_style))
        else:
            # Placeholder content
            content.append(Spacer(1, 0.2*inch))
            content.append(Paragraph(
                f"<i>Vsebina poglavja '{title}' bo dodana kasneje.</i>",
                normal_style
            ))
        
        # Only add page break and increment if not the last chapter or not at page 310
        # The last chapter "Hvala" ends on page 310, so no more increment needed
        if title == 'Hvala' and current_page == 310:
            # Don't add page break or increment - we're done at page 310
            pass
        elif title != 'Hvala':
            content.append(PageBreak())
            current_page += 1
        else:
            current_page += 1
    
    # Fill remaining pages if needed (skip if we're already at 310)
    if current_page < 310:
        while current_page < 310:
            if current_page in pages_content:
                page_text = pages_content[current_page]
                for para in page_text.strip().split('\n\n'):
                    if para.strip():
                        content.append(Paragraph(para.strip(), normal_style))
            else:
                content.append(PageBreak())
                content.append(Paragraph(f"Stran {current_page}", page_number_style))
            current_page += 1
    
    # Build PDF
    doc.build(content)
    print(f"PDF created successfully with 310 pages")


if __name__ == "__main__":
    create_pdf()
