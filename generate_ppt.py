# Upgraded PowerPoint generator for Eco Chain Shipping
import os
import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE
from pptx.dml.color import RGBColor

def build_perfect_presentation():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Theme Colors - Modern Blockchain + Logistics + Eco Palette
    BG_DARK = RGBColor(10, 16, 30)         # #0A101E Deep Midnight Navy
    BG_CARD = RGBColor(19, 30, 49)         # #131E31 Slate Blue Container
    BG_CARD_LIGHT = RGBColor(26, 41, 66)   # #1A2942 Elevated Card
    BG_CARD_INNER = RGBColor(14, 23, 38)   # #0E1726 Inner Card
    
    EMERALD = RGBColor(16, 185, 129)       # #10B981 Vibrant Green (Eco)
    EMERALD_BG = RGBColor(6, 78, 59)       # #064E3B Dark Green
    EMERALD_BORDER = RGBColor(5, 150, 105) # #059669
    
    CYAN = RGBColor(56, 189, 248)          # #38BDF8 Sky Cyan
    CYAN_BORDER = RGBColor(6, 182, 212)    # #06B6D4
    
    RED = RGBColor(239, 68, 68)            # #EF4444 Danger Red
    RED_BG = RGBColor(127, 29, 29)         # #7F1D1D
    RED_BORDER = RGBColor(220, 38, 38)     # #DC2626
    
    AMBER = RGBColor(245, 158, 11)         # #F59E0B Warning Amber
    AMBER_BG = RGBColor(120, 53, 15)       # #78350F
    
    WHITE = RGBColor(255, 255, 255)
    SLATE_LIGHT = RGBColor(226, 232, 240)  # #E2E8F0
    SLATE_MUTED = RGBColor(148, 163, 184)  # #94A3B8
    BORDER_SUBTLE = RGBColor(34, 52, 80)   # #223450

    def set_slide_background(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
        bg.fill.solid()
        bg.fill.fore_color.rgb = BG_DARK
        bg.line.fill.background()
        return bg

    def add_header(slide, tag_text, title_text, subtitle_text=None, tag_color=EMERALD):
        tag_box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.42), Inches(3.4), Inches(0.32))
        tag_box.fill.solid()
        tag_box.fill.fore_color.rgb = BG_CARD
        tag_box.line.color.rgb = tag_color
        tag_box.line.width = Pt(1)
        tf_tag = tag_box.text_frame
        tf_tag.word_wrap = True
        tf_tag.vertical_anchor = MSO_ANCHOR.MIDDLE
        p_tag = tf_tag.paragraphs[0]
        p_tag.alignment = PP_ALIGN.CENTER
        run_tag = p_tag.add_run()
        run_tag.text = tag_text.upper()
        run_tag.font.name = "Segoe UI"
        run_tag.font.size = Pt(9.5)
        run_tag.font.bold = True
        run_tag.font.color.rgb = tag_color

        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.78), Inches(11.7), Inches(0.65))
        tf_title = title_box.text_frame
        tf_title.word_wrap = True
        tf_title.margin_left = tf_title.margin_top = tf_title.margin_right = tf_title.margin_bottom = 0
        p_title = tf_title.paragraphs[0]
        run_title = p_title.add_run()
        run_title.text = title_text
        run_title.font.name = "Segoe UI"
        run_title.font.size = Pt(21)
        run_title.font.bold = True
        run_title.font.color.rgb = WHITE

        if subtitle_text:
            p_sub = tf_title.add_paragraph()
            run_sub = p_sub.add_run()
            run_sub.text = subtitle_text
            run_sub.font.name = "Segoe UI"
            run_sub.font.size = Pt(10.5)
            run_sub.font.color.rgb = SLATE_MUTED

    def add_card(slide, left, top, width, height, bg_color=BG_CARD, border_color=BORDER_SUBTLE, border_width=1):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left), Inches(top), Inches(width), Inches(height))
        card.fill.solid()
        card.fill.fore_color.rgb = bg_color
        if border_color:
            card.line.color.rgb = border_color
            card.line.width = Pt(border_width)
        else:
            card.line.fill.background()
        return card

    def add_notes(slide, notes_text):
        notes_slide = slide.notes_slide
        tf = notes_slide.notes_text_frame
        tf.text = notes_text.strip()

    # =========================================================================
    # SLIDE 1: TITLE SLIDE
    # =========================================================================
    s1 = prs.slides.add_slide(blank_layout)
    set_slide_background(s1)

    top_badge = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.75), Inches(4.5), Inches(0.38))
    top_badge.fill.solid()
    top_badge.fill.fore_color.rgb = BG_CARD
    top_badge.line.color.rgb = EMERALD
    top_badge.line.width = Pt(1.5)
    tf_tb = top_badge.text_frame
    tf_tb.vertical_anchor = MSO_ANCHOR.MIDDLE
    p_tb = tf_tb.paragraphs[0]
    p_tb.alignment = PP_ALIGN.CENTER
    r_tb = p_tb.add_run()
    r_tb.text = "ACADEMIC PROJECT REVIEW & EVALUATION"
    r_tb.font.name = "Segoe UI"
    r_tb.font.size = Pt(10)
    r_tb.font.bold = True
    r_tb.font.color.rgb = EMERALD

    t_box = s1.shapes.add_textbox(Inches(0.8), Inches(1.3), Inches(11.7), Inches(2.2))
    tf_t = t_box.text_frame
    tf_t.word_wrap = True
    p1 = tf_t.paragraphs[0]
    r1 = p1.add_run()
    r1.text = "ECO CHAIN SHIPPING"
    r1.font.name = "Segoe UI"
    r1.font.size = Pt(40)
    r1.font.bold = True
    r1.font.color.rgb = WHITE

    p2 = tf_t.add_paragraph()
    r2 = p2.add_run()
    r2.text = "Blockchain-Based Secure and Transparent Shipping Management System"
    r2.font.name = "Segoe UI"
    r2.font.size = Pt(18)
    r2.font.bold = True
    r2.font.color.rgb = CYAN

    p3 = tf_t.add_paragraph()
    p3.space_before = Pt(4)
    r3 = p3.add_run()
    r3.text = "An educational blockchain simulation demonstrating immutable freight records, SHA-256 integrity, Proof of Work mining, and smart contract escrow for sustainable logistics."
    r3.font.name = "Segoe UI"
    r3.font.size = Pt(12)
    r3.font.color.rgb = SLATE_LIGHT

    tags = ["SHA-256 Hashing", "Proof of Work Consensus", "Merkle Tree Aggregation", "Smart Contract Escrow", "Tamper Detection Lab"]
    for i, tag in enumerate(tags):
        tag_s = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8 + i * 2.35), Inches(3.6), Inches(2.2), Inches(0.35))
        tag_s.fill.solid()
        tag_s.fill.fore_color.rgb = BG_CARD_LIGHT
        tag_s.line.color.rgb = BORDER_SUBTLE
        tf_ts = tag_s.text_frame
        tf_ts.vertical_anchor = MSO_ANCHOR.MIDDLE
        p_ts = tf_ts.paragraphs[0]
        p_ts.alignment = PP_ALIGN.CENTER
        r_ts = p_ts.add_run()
        r_ts.text = f"✔ {tag}"
        r_ts.font.name = "Segoe UI"
        r_ts.font.size = Pt(9.5)
        r_ts.font.bold = True
        r_ts.font.color.rgb = EMERALD

    # Left Card: Student Team Placeholders
    add_card(s1, 0.8, 4.2, 5.7, 2.65, BG_CARD, BORDER_SUBTLE)
    s_meta1 = s1.shapes.add_textbox(Inches(1.05), Inches(4.35), Inches(5.2), Inches(2.35))
    tf_m1 = s_meta1.text_frame
    tf_m1.word_wrap = True
    p = tf_m1.paragraphs[0]
    r = p.add_run()
    r.text = "STUDENT PARTICIPANTS"
    r.font.name = "Segoe UI"
    r.font.size = Pt(11)
    r.font.bold = True
    r.font.color.rgb = CYAN

    fields1 = [
        ("Student Name(s):", "[Student Name(s) Placeholder]"),
        ("Roll Number(s):", "[Roll Number(s) Placeholder]"),
        ("Department:", "[Department - e.g., Computer Science & Engineering]"),
        ("Academic Year:", "2025 – 2026")
    ]
    for lbl, val in fields1:
        p = tf_m1.add_paragraph()
        p.space_before = Pt(4)
        r_lbl = p.add_run()
        r_lbl.text = f"{lbl} "
        r_lbl.font.name = "Segoe UI"
        r_lbl.font.size = Pt(11)
        r_lbl.font.bold = True
        r_lbl.font.color.rgb = SLATE_MUTED
        r_val = p.add_run()
        r_val.text = val
        r_val.font.name = "Segoe UI"
        r_val.font.size = Pt(11)
        r_val.font.color.rgb = WHITE

    # Right Card: Project Guide Placeholders
    add_card(s1, 6.8, 4.2, 5.7, 2.65, BG_CARD, BORDER_SUBTLE)
    s_meta2 = s1.shapes.add_textbox(Inches(7.05), Inches(4.35), Inches(5.2), Inches(2.35))
    tf_m2 = s_meta2.text_frame
    tf_m2.word_wrap = True
    p = tf_m2.paragraphs[0]
    r = p.add_run()
    r.text = "MENTORSHIP & COLLEGE DETAILS"
    r.font.name = "Segoe UI"
    r.font.size = Pt(11)
    r.font.bold = True
    r.font.color.rgb = EMERALD

    fields2 = [
        ("Project Guide Name:", "[Guide Name / Mentor Placeholder]"),
        ("Designation:", "Assistant Professor / Faculty Mentor"),
        ("College / University:", "[College / University Name Placeholder]"),
        ("Project Scope:", "Major / Mini Project Evaluation")
    ]
    for lbl, val in fields2:
        p = tf_m2.add_paragraph()
        p.space_before = Pt(4)
        r_lbl = p.add_run()
        r_lbl.text = f"{lbl} "
        r_lbl.font.name = "Segoe UI"
        r_lbl.font.size = Pt(11)
        r_lbl.font.bold = True
        r_lbl.font.color.rgb = SLATE_MUTED
        r_val = p.add_run()
        r_val.text = val
        r_val.font.name = "Segoe UI"
        r_val.font.size = Pt(11)
        r_val.font.color.rgb = WHITE

    add_notes(s1, """
Respected faculty and review committee members, welcome to our project review presentation.
Our project is titled 'Eco Chain Shipping: Blockchain-Based Secure and Transparent Shipping Management System'.
Global shipping currently faces major challenges with data manipulation, cargo disputes, and lack of transparency between multiple untrusted parties.
To solve this, we designed and implemented a full-stack educational blockchain application from scratch.
Over the next slides, we will explain the foundational concepts, architecture, and live demonstration of all twelve required blockchain principles.
""")

    # =========================================================================
    # SLIDE 2: INTRODUCTION
    # =========================================================================
    s2 = prs.slides.add_slide(blank_layout)
    set_slide_background(s2)
    add_header(s2, "Foundational Concepts", "Introduction: What is Blockchain?", "Core properties of distributed ledgers applied to modern shipping logistics")

    cards2 = [
        ("1. What is Blockchain?", "Distributed & Tamper-Resistant Ledger", [
            "A decentralized digital ledger shared across network nodes.",
            "Eliminates reliance on any single centralized database authority.",
            "Data is tamper-resistant: historical records cannot be silently rewritten.",
            "Builds mathematical trust between independent, untrusted parties."
        ], EMERALD),
        ("2. How Blocks Connect", "Cryptographic Hash Linking", [
            "Data is bundled into discrete structures called Blocks.",
            "Blocks are linked sequentially using SHA-256 cryptographic hashes.",
            "Every block stores the exact hash of the previous block.",
            "Creates an unbroken chain: changing any block breaks the entire chain."
        ], CYAN),
        ("3. Shipping Application", "Transforming Modern Logistics", [
            "Shipping involves multiple entities: shippers, carriers, ports, customs.",
            "Our project applies these concepts to shipping management.",
            "Tracks custody handovers, cargo weights, and carbon emission savings.",
            "Guarantees that cargo records and payments cannot be altered."
        ], AMBER)
    ]

    for i, (title, subtitle, points, accent) in enumerate(cards2):
        x = 0.8 + i * 3.95
        add_card(s2, x, 1.7, 3.8, 4.3, BG_CARD, BORDER_SUBTLE)
        
        strip = s2.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(x), Inches(1.7), Inches(3.8), Inches(0.08))
        strip.fill.solid()
        strip.fill.fore_color.rgb = accent
        strip.line.fill.background()

        tb = s2.shapes.add_textbox(Inches(x + 0.25), Inches(1.95), Inches(3.3), Inches(3.9))
        tf = tb.text_frame
        tf.word_wrap = True
        
        p = tf.paragraphs[0]
        r = p.add_run()
        r.text = title
        r.font.name = "Segoe UI"
        r.font.size = Pt(13)
        r.font.bold = True
        r.font.color.rgb = accent

        p_sub = tf.add_paragraph()
        r_sub = p_sub.add_run()
        r_sub.text = subtitle
        r_sub.font.name = "Segoe UI"
        r_sub.font.size = Pt(10.5)
        r_sub.font.bold = True
        r_sub.font.color.rgb = WHITE
        p_sub.space_after = Pt(10)

        for pt in points:
            p_pt = tf.add_paragraph()
            p_pt.space_before = Pt(6)
            r_dot = p_pt.add_run()
            r_dot.text = "▪ "
            r_dot.font.name = "Segoe UI"
            r_dot.font.size = Pt(10)
            r_dot.font.bold = True
            r_dot.font.color.rgb = accent
            
            r_txt = p_pt.add_run()
            r_txt.text = pt
            r_txt.font.name = "Segoe UI"
            r_txt.font.size = Pt(10.5)
            r_txt.font.color.rgb = SLATE_LIGHT

    # Bottom summary banner
    add_card(s2, 0.8, 6.2, 11.7, 0.75, BG_CARD_LIGHT, BORDER_SUBTLE)
    b_box = s2.shapes.add_textbox(Inches(1.0), Inches(6.25), Inches(11.3), Inches(0.65))
    tf_b = b_box.text_frame
    tf_b.word_wrap = True
    p_b = tf_b.paragraphs[0]
    r_b1 = p_b.add_run()
    r_b1.text = "Core Takeaway: "
    r_b1.font.name = "Segoe UI"
    r_b1.font.size = Pt(11)
    r_b1.font.bold = True
    r_b1.font.color.rgb = EMERALD
    r_b2 = p_b.add_run()
    r_b2.text = "Blockchain is a distributed and tamper-resistant digital ledger. Data is stored in blocks connected using cryptographic hashes, where every block contains information about the previous block. Our project applies these exact concepts to shipping management."
    r_b2.font.name = "Segoe UI"
    r_b2.font.size = Pt(10.5)
    r_b2.font.color.rgb = WHITE

    add_notes(s2, """
Blockchain is a distributed and tamper-resistant digital ledger.
Instead of storing all information in a central database, data is stored in blocks connected using cryptographic hashes.
Every block contains information about the previous block, forming an unbreakable chain.
Because of this connection, changing old data can be detected easily and immediately.
In our project, we apply these exact blockchain concepts to shipping management to ensure every shipment status and payment is permanent and verifiable.
""")

    # =========================================================================
    # SLIDE 3: PROBLEM STATEMENT
    # =========================================================================
    s3 = prs.slides.add_slide(blank_layout)
    set_slide_background(s3)
    add_header(s3, "Current Challenges", "Problem Statement: Flaws in Traditional Shipping", "Why centralized databases fail modern global supply chains")

    # Left Column: Detailed Pain Points (6 cards)
    add_card(s3, 0.8, 1.65, 6.6, 5.35, BG_CARD, BORDER_SUBTLE)
    tb_l = s3.shapes.add_textbox(Inches(1.05), Inches(1.8), Inches(6.1), Inches(5.0))
    tf_l = tb_l.text_frame
    tf_l.word_wrap = True

    p = tf_l.paragraphs[0]
    r = p.add_run()
    r.text = "PROBLEMS IN TRADITIONAL SHIPPING MANAGEMENT"
    r.font.name = "Segoe UI"
    r.font.size = Pt(12)
    r.font.bold = True
    r.font.color.rgb = RED

    problems = [
        ("Centralized Data Storage:", "All logistics manifests and records are stored on a single company's database, creating a single point of failure."),
        ("Data Manipulation:", "Records can be modified or deleted without easy detection, enabling invoice and cargo falsification."),
        ("Lack of Transparency:", "Independent parties—shippers, freight forwarders, carriers—cannot independently verify records."),
        ("Difficulty in Tracking History:", "Tracking full shipment history and custody transitions across separate systems is slow and unreliable."),
        ("Lack of Trust Between Parties:", "Companies do not trust each other's proprietary logs, leading to costly billing disputes and delays."),
        ("Silent Modification Without Detection:", "Traditional databases have no cryptographic linking, meaning unauthorized modifications go completely unnoticed.")
    ]

    for title, desc in problems:
        p = tf_l.add_paragraph()
        p.space_before = Pt(7)
        r_icon = p.add_run()
        r_icon.text = "✖ "
        r_icon.font.name = "Segoe UI"
        r_icon.font.size = Pt(10)
        r_icon.font.bold = True
        r_icon.font.color.rgb = RED

        r_t = p.add_run()
        r_t.text = f"{title} "
        r_t.font.name = "Segoe UI"
        r_t.font.size = Pt(10.5)
        r_t.font.bold = True
        r_t.font.color.rgb = WHITE

        r_d = p.add_run()
        r_d.text = desc
        r_d.font.name = "Segoe UI"
        r_d.font.size = Pt(10)
        r_d.font.color.rgb = SLATE_LIGHT

    # Right Column: Visual Diagram of Failure Mode
    add_card(s3, 7.7, 1.65, 4.8, 5.35, BG_CARD, RED_BORDER, border_width=1.5)
    tb_r = s3.shapes.add_textbox(Inches(7.95), Inches(1.8), Inches(4.3), Inches(0.5))
    tf_r = tb_r.text_frame
    p = tf_r.paragraphs[0]
    r = p.add_run()
    r.text = "TRADITIONAL SYSTEM ARCHITECTURE"
    r.font.name = "Segoe UI"
    r.font.size = Pt(12)
    r.font.bold = True
    r.font.color.rgb = RED

    tf_steps = [
        ("Traditional System", "Shippers & Carriers submit records", BG_CARD_LIGHT, WHITE),
        ("Centralized Database", "Single point of control & vulnerability", RED_BG, WHITE),
        ("Data Manipulation", "Records altered without cryptographic trace", RED_BG, RED),
        ("Limited Transparency & Trust", "Disputes, delays, and zero mutual confidence", BG_CARD_LIGHT, AMBER)
    ]

    for i, (f_title, f_desc, f_bg, f_txt) in enumerate(tf_steps):
        y = 2.45 + i * 1.15
        fb = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(8.0), Inches(y), Inches(4.2), Inches(0.78))
        fb.fill.solid()
        fb.fill.fore_color.rgb = f_bg
        fb.line.color.rgb = RED if f_bg == RED_BG else BORDER_SUBTLE
        tf_fb = fb.text_frame
        tf_fb.word_wrap = True
        tf_fb.vertical_anchor = MSO_ANCHOR.MIDDLE
        p_fb = tf_fb.paragraphs[0]
        p_fb.alignment = PP_ALIGN.CENTER
        r_fb = p_fb.add_run()
        r_fb.text = f_title
        r_fb.font.name = "Segoe UI"
        r_fb.font.size = Pt(10.5)
        r_fb.font.bold = True
        r_fb.font.color.rgb = f_txt
        p_fb2 = tf_fb.add_paragraph()
        p_fb2.alignment = PP_ALIGN.CENTER
        r_fb2 = p_fb2.add_run()
        r_fb2.text = f_desc
        r_fb2.font.name = "Segoe UI"
        r_fb2.font.size = Pt(9)
        r_fb2.font.color.rgb = SLATE_LIGHT

        # Connector arrow
        if i < 3:
            arr = s3.shapes.add_textbox(Inches(9.9), Inches(y + 0.78), Inches(0.5), Inches(0.35))
            tf_arr = arr.text_frame
            tf_arr.margin_left = tf_arr.margin_top = tf_arr.margin_right = tf_arr.margin_bottom = 0
            p_arr = tf_arr.paragraphs[0]
            p_arr.alignment = PP_ALIGN.CENTER
            r_arr = p_arr.add_run()
            r_arr.text = "↓"
            r_arr.font.name = "Segoe UI"
            r_arr.font.size = Pt(14)
            r_arr.font.bold = True
            r_arr.font.color.rgb = RED

    add_notes(s3, """
In traditional shipping, management relies almost entirely on centralized databases.
This creates six serious problems: single points of failure, vulnerability to data manipulation, lack of transparency, difficulty in tracking shipment history, and zero mutual trust.
Because regular databases do not link records cryptographically, anyone with server access can modify values without being detected.
This leads to frequent disputes over cargo weight, custody handovers, and billing amounts.
Our visual diagram shows how centralized databases inevitably lead to data manipulation and limited transparency.
""")

    # =========================================================================
    # SLIDE 4: PROPOSED SOLUTION
    # =========================================================================
    s4 = prs.slides.add_slide(blank_layout)
    set_slide_background(s4)
    add_header(s4, "The Proposed Architecture", "Proposed Solution: Eco Chain Shipping", "Using blockchain concepts to build an immutable, transparent shipping record")

    add_card(s4, 0.8, 1.65, 11.7, 1.2, BG_CARD, BORDER_SUBTLE)
    tb_ov = s4.shapes.add_textbox(Inches(1.05), Inches(1.75), Inches(11.2), Inches(1.0))
    tf_ov = tb_ov.text_frame
    tf_ov.word_wrap = True

    p = tf_ov.paragraphs[0]
    r = p.add_run()
    r.text = "INTRODUCING ECO CHAIN SHIPPING"
    r.font.name = "Segoe UI"
    r.font.size = Pt(11)
    r.font.bold = True
    r.font.color.rgb = EMERALD

    p_d = tf_ov.add_paragraph()
    p_d.space_before = Pt(3)
    r_d = p_d.add_run()
    r_d.text = "Eco Chain Shipping uses blockchain concepts to create a secure, transparent, and immutable shipping record. Every custody change and payment milestone is converted into a validated transaction, mined into an immutable block, and exposed for public audit via our Blockchain Explorer."
    r_d.font.name = "Segoe UI"
    r_d.font.size = Pt(11)
    r_d.font.color.rgb = WHITE

    # 7-Step Pipeline requested by user:
    # Shipment -> Transaction -> Validation -> Blockchain -> Mining -> Secure Record -> Blockchain Explorer
    pipeline = [
        ("Shipment", "Cargo manifest & eco score created", EMERALD),
        ("Transaction", "Payment/custody queued in mempool", CYAN),
        ("Validation", "5-rule engine checks balances & identity", WHITE),
        ("Blockchain", "Transactions organized into block", CYAN),
        ("Mining", "PoW nonce puzzle solved by miner", AMBER),
        ("Secure Record", "Cryptographically sealed immutable block", EMERALD),
        ("Blockchain Explorer", "Live transparent public verification", WHITE)
    ]

    card_width = 1.55
    spacing = 0.14
    for i, (p_title, p_desc, p_acc) in enumerate(pipeline):
        x = 0.8 + i * (card_width + spacing)
        add_card(s4, x, 3.1, card_width, 2.8, BG_CARD, BORDER_SUBTLE)

        chip = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(x + 0.15), Inches(3.25), Inches(card_width - 0.3), Inches(0.32))
        chip.fill.solid()
        chip.fill.fore_color.rgb = BG_CARD_LIGHT
        chip.line.color.rgb = p_acc
        tf_chip = chip.text_frame
        tf_chip.vertical_anchor = MSO_ANCHOR.MIDDLE
        p_c = tf_chip.paragraphs[0]
        p_c.alignment = PP_ALIGN.CENTER
        r_c = p_c.add_run()
        r_c.text = f"STEP 0{i+1}"
        r_c.font.name = "Segoe UI"
        r_c.font.size = Pt(9)
        r_c.font.bold = True
        r_c.font.color.rgb = p_acc

        tb_step = s4.shapes.add_textbox(Inches(x + 0.1), Inches(3.7), Inches(card_width - 0.2), Inches(2.0))
        tf_s = tb_step.text_frame
        tf_s.word_wrap = True
        p_st = tf_s.paragraphs[0]
        r_st = p_st.add_run()
        r_st.text = p_title
        r_st.font.name = "Segoe UI"
        r_st.font.size = Pt(11)
        r_st.font.bold = True
        r_st.font.color.rgb = WHITE

        p_sd = tf_s.add_paragraph()
        p_sd.space_before = Pt(6)
        r_sd = p_sd.add_run()
        r_sd.text = p_desc
        r_sd.font.name = "Segoe UI"
        r_sd.font.size = Pt(9.5)
        r_sd.font.color.rgb = SLATE_LIGHT

    # Bottom Educational simulation notice
    add_card(s4, 0.8, 6.15, 11.7, 0.8, BG_CARD_LIGHT, CYAN_BORDER)
    tb_not = s4.shapes.add_textbox(Inches(1.05), Inches(6.2), Inches(11.2), Inches(0.7))
    tf_not = tb_not.text_frame
    tf_not.word_wrap = True
    p_n = tf_not.paragraphs[0]
    r_n1 = p_n.add_run()
    r_n1.text = "Educational Simulation Notice: "
    r_n1.font.name = "Segoe UI"
    r_n1.font.size = Pt(10.5)
    r_n1.font.bold = True
    r_n1.font.color.rgb = CYAN
    r_n2 = p_n.add_run()
    r_n2.text = "This project is an educational blockchain simulation designed for college review and demonstration. It implements genuine cryptographic hashing (SHA-256) and consensus rules natively in JavaScript without requiring real financial cryptocurrency."
    r_n2.font.name = "Segoe UI"
    r_n2.font.size = Pt(10)
    r_n2.font.color.rgb = WHITE

    add_notes(s4, """
Our proposed solution is Eco Chain Shipping, which uses blockchain concepts to create a secure and transparent shipping record.
The lifecycle follows a clear sequence: first a shipment is created, then turned into a transaction, validated by system rules, added to the blockchain layer, mined using Proof of Work, turned into a secure immutable record, and made auditable on our Blockchain Explorer.
By implementing this workflow, all shipping operations become traceable and tamper-proof.
We explicitly highlight that this is an educational simulation created for college learning and demonstration.
""")

    # =========================================================================
    # SLIDE 5: OBJECTIVES
    # =========================================================================
    s5 = prs.slides.add_slide(blank_layout)
    set_slide_background(s5)
    add_header(s5, "Project Objectives", "Core Objectives & Key Deliverables", "Ten primary benchmarks implemented to demonstrate blockchain mechanics in shipping")

    # 10 objectives from user prompt
    objs_10 = [
        ("🔒", "Secure Shipment Records", "Store manifests and cargo data securely on chain", EMERALD),
        ("🛡️", "Maintain Data Integrity", "Ensure historic blocks remain mathematically protected", CYAN),
        ("⚠️", "Detect Tampering", "Instantly flag unauthorized modifications in the ledger", RED),
        ("⚖️", "Validate Transactions", "Enforce 5-rule criteria before adding transactions", CYAN),
        ("⛓️", "Demonstrate Blockchain Creation", "Initialize Genesis block and link sequential blocks", WHITE),
        ("⛏️", "Implement Proof of Work", "Simulate hash puzzles with nonce adjustment", AMBER),
        ("👛", "Implement Wallets & Transactions", "Manage demo keys, balances, and P2P transfers", CYAN),
        ("🌳", "Generate Merkle Root", "Combine transactions into binary hash trees", EMERALD),
        ("📜", "Simulate Smart Contracts", "Enforce shipping milestone rules and escrow payouts", AMBER),
        ("🔍", "Provide Blockchain Exploration", "Offer live search and audit tools for all blocks", WHITE)
    ]

    for i, (ico, o_title, o_desc, o_col) in enumerate(objs_10):
        row = i // 5
        col = i % 5
        x = 0.8 + col * 2.38
        y = 1.7 + row * 2.45
        add_card(s5, x, y, 2.25, 2.3, BG_CARD, BORDER_SUBTLE)

        tb = s5.shapes.add_textbox(Inches(x + 0.15), Inches(y + 0.15), Inches(1.95), Inches(2.0))
        tf = tb.text_frame
        tf.word_wrap = True

        p = tf.paragraphs[0]
        r_ico = p.add_run()
        r_ico.text = f"{ico}\n"
        r_ico.font.size = Pt(18)
        
        r_t = p.add_run()
        r_t.text = f"{o_title}\n"
        r_t.font.name = "Segoe UI"
        r_t.font.size = Pt(10)
        r_t.font.bold = True
        r_t.font.color.rgb = WHITE

        p_d = tf.add_paragraph()
        p_d.space_before = Pt(4)
        r_d = p_d.add_run()
        r_d.text = o_desc
        r_d.font.name = "Segoe UI"
        r_d.font.size = Pt(9)
        r_d.font.color.rgb = SLATE_LIGHT

        # Bottom accent
        bline = s5.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(x + 0.15), Inches(y + 2.1), Inches(1.95), Inches(0.04))
        bline.fill.solid()
        bline.fill.fore_color.rgb = o_col
        bline.line.fill.background()

    # Bottom summary
    add_card(s5, 0.8, 6.75, 11.7, 0.45, BG_CARD_LIGHT, BORDER_SUBTLE)
    tb_b = s5.shapes.add_textbox(Inches(1.05), Inches(6.75), Inches(11.2), Inches(0.4))
    tf_b = tb_b.text_frame
    p = tf_b.paragraphs[0]
    r = p.add_run()
    r.text = "Implementation Status: "
    r.font.name = "Segoe UI"
    r.font.size = Pt(9.5)
    r.font.bold = True
    r.font.color.rgb = EMERALD
    r2 = p.add_run()
    r2.text = "All 10 project objectives are fully implemented and verified with automated test suites."
    r2.font.name = "Segoe UI"
    r2.font.size = Pt(9.5)
    r2.font.color.rgb = WHITE

    add_notes(s5, """
The main objectives of our project are clearly outlined on this slide.
We aimed to secure shipment records, maintain data integrity, detect tampering, and validate transactions.
Additionally, we set out to demonstrate blockchain creation, implement Proof of Work mining, implement wallets and transactions, generate Merkle roots, simulate smart contracts, and provide a full blockchain explorer.
Every single one of these objectives has been implemented with functional code and tested thoroughly.
""")

    # =========================================================================
    # SLIDE 6: TECHNOLOGIES USED
    # =========================================================================
    s6 = prs.slides.add_slide(blank_layout)
    set_slide_background(s6)
    add_header(s6, "Technology Stack", "Technologies Used in the Project", "Clean technology architecture accurately reflecting implemented tools")

    tech_stacks = [
        ("FRONTEND", "User Interface Tier", [
            ("React", "Component-based single page UI"),
            ("HTML5", "Modern semantic page markup"),
            ("CSS / Tailwind", "Responsive dark-mode styling"),
            ("JavaScript", "Client-side interactive state & API calls")
        ], CYAN),
        ("BACKEND", "Server & API Tier", [
            ("Node.js", "Asynchronous JavaScript runtime environment"),
            ("Express.js", "RESTful API routes for blockchain operations"),
            ("CORS & JSON", "REST communication & serialization"),
            ("OOP Controllers", "Modular classes for chain & shipments")
        ], EMERALD),
        ("BLOCKCHAIN CORE", "Custom JavaScript Engine", [
            ("Custom JS Blockchain", "Native implementation of chain & blocks"),
            ("SHA-256 Hashing", "Native Node.js crypto cryptographic digests"),
            ("Proof of Work", "Iterative nonce-mining consensus algorithm"),
            ("Merkle Tree", "Pairwise binary transaction hash aggregation")
        ], AMBER),
        ("DATABASE / STORAGE", "Ledger Storage Tier", [
            ("In-Memory Storage", "Zero-latency active chain & mempool queue"),
            ("Local Storage", "Client session state & preferences"),
            ("MongoDB Ready", "Extensible schema for persistent ledger logs"),
            ("Tamper Simulation", "Dynamic state mutation for review demos")
        ], WHITE)
    ]

    for i, (t_tier, t_sub, t_items, t_acc) in enumerate(tech_stacks):
        x = 0.8 + i * 2.95
        add_card(s6, x, 1.7, 2.8, 4.4, BG_CARD, BORDER_SUBTLE)

        hbar = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(x + 0.15), Inches(1.85), Inches(2.5), Inches(0.45))
        hbar.fill.solid()
        hbar.fill.fore_color.rgb = BG_CARD_LIGHT
        hbar.line.color.rgb = t_acc
        tf_h = hbar.text_frame
        tf_h.vertical_anchor = MSO_ANCHOR.MIDDLE
        p_h = tf_h.paragraphs[0]
        p_h.alignment = PP_ALIGN.CENTER
        r_h = p_h.add_run()
        r_h.text = t_tier
        r_h.font.name = "Segoe UI"
        r_h.font.size = Pt(10)
        r_h.font.bold = True
        r_h.font.color.rgb = t_acc

        tb_i = s6.shapes.add_textbox(Inches(x + 0.15), Inches(2.45), Inches(2.5), Inches(3.5))
        tf_i = tb_i.text_frame
        tf_i.word_wrap = True

        p_sub = tf_i.paragraphs[0]
        r_sub = p_sub.add_run()
        r_sub.text = t_sub
        r_sub.font.name = "Segoe UI"
        r_sub.font.size = Pt(9.5)
        r_sub.font.color.rgb = SLATE_MUTED
        p_sub.space_after = Pt(8)

        for name, desc in t_items:
            p = tf_i.add_paragraph()
            p.space_before = Pt(6)
            r_n = p.add_run()
            r_n.text = f"✔ {name}\n"
            r_n.font.name = "Segoe UI"
            r_n.font.size = Pt(10)
            r_n.font.bold = True
            r_n.font.color.rgb = WHITE
            r_d = p.add_run()
            r_d.text = desc
            r_d.font.name = "Segoe UI"
            r_d.font.size = Pt(8.5)
            r_d.font.color.rgb = SLATE_LIGHT

    add_card(s6, 0.8, 6.25, 11.7, 0.8, BG_CARD_LIGHT, EMERALD_BORDER)
    tb_hon = s6.shapes.add_textbox(Inches(1.05), Inches(6.3), Inches(11.2), Inches(0.7))
    tf_hon = tb_hon.text_frame
    tf_hon.word_wrap = True
    p = tf_hon.paragraphs[0]
    r1 = p.add_run()
    r1.text = "Accurate Stack Guarantee: "
    r1.font.name = "Segoe UI"
    r1.font.size = Pt(10.5)
    r1.font.bold = True
    r1.font.color.rgb = EMERALD
    r2 = p.add_run()
    r2.text = "This project exclusively uses the technologies listed above. We do not claim external blockchain networks (like Ethereum or Hyperledger) that are not part of this implementation. The custom JavaScript blockchain gives us full algorithmic control."
    r2.font.name = "Segoe UI"
    r2.font.size = Pt(10)
    r2.font.color.rgb = WHITE

    add_notes(s6, """
For our technology stack, we chose standard, robust web technologies.
On the frontend, we use React along with HTML, CSS, and modern JavaScript for a responsive single page dashboard.
On the backend, Node.js and Express.js handle API routing and server-side logic.
For the blockchain layer, we engineered a custom JavaScript blockchain utilizing standard SHA-256 hashing and Proof of Work consensus.
Data is managed via in-memory ledger structures with optional local storage and MongoDB readiness.
We do not claim any technologies that were not actually coded into the project.
""")

    # =========================================================================
    # SLIDE 7: SYSTEM ARCHITECTURE (WITH PRECISE USER FLOW)
    # =========================================================================
    s7 = prs.slides.add_slide(blank_layout)
    set_slide_background(s7)
    add_header(s7, "System Architecture", "System Architecture & End-to-End Flow", "Detailed multi-layer architecture from user interaction down to storage and explorer")

    # Flow specified by user:
    # User -> Eco Chain Shipping Web Application -> Shipment Management -> Transaction Layer -> Blockchain Layer -> Hashing + Merkle Tree -> Proof of Work / Mining -> Blockchain Storage -> Blockchain Explorer
    arch_flow = [
        ("1. User", "Shippers, carriers, and faculty examiners initiating operations", CYAN),
        ("2. Web Application", "React frontend dashboard delivering interactive visualizations", WHITE),
        ("3. Shipment Management", "Logistics controller registering manifests and status changes", EMERALD),
        ("4. Transaction Layer", "Converts shipping events into signed transactions in mempool", CYAN),
        ("5. Blockchain Layer", "Organizes transactions into discrete block structures", WHITE),
        ("6. Hashing + Merkle Tree", "Calculates SHA-256 digests and builds binary Merkle root", AMBER),
        ("7. Proof of Work / Mining", "Solves difficulty target by incrementing nonce counter", AMBER),
        ("8. Blockchain Storage", "Appends mined block to immutable chained array ledger", EMERALD),
        ("9. Blockchain Explorer", "Public visual inspection tool auditing all blocks and hashes", CYAN)
    ]

    # Two-column layout: Left column flow cards (1 to 5), Right column flow cards (6 to 9) with descriptions
    # Left Column (1 to 5)
    for i in range(5):
        num_title, desc, col = arch_flow[i]
        y = 1.65 + i * 1.05
        add_card(s7, 0.8, y, 5.7, 0.92, BG_CARD, BORDER_SUBTLE)

        # Step indicator
        pill = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.95), Inches(y + 0.16), Inches(2.2), Inches(0.6))
        pill.fill.solid()
        pill.fill.fore_color.rgb = BG_CARD_LIGHT
        pill.line.color.rgb = col
        tf_p = pill.text_frame
        tf_p.vertical_anchor = MSO_ANCHOR.MIDDLE
        p_p = tf_p.paragraphs[0]
        p_p.alignment = PP_ALIGN.CENTER
        r_p = p_p.add_run()
        r_p.text = num_title
        r_p.font.name = "Segoe UI"
        r_p.font.size = Pt(9.5)
        r_p.font.bold = True
        r_p.font.color.rgb = col

        tb_d = s7.shapes.add_textbox(Inches(3.25), Inches(y + 0.12), Inches(3.1), Inches(0.7))
        tf_d = tb_d.text_frame
        tf_d.word_wrap = True
        p_d = tf_d.paragraphs[0]
        r_d = p_d.add_run()
        r_d.text = desc
        r_d.font.name = "Segoe UI"
        r_d.font.size = Pt(9.5)
        r_d.font.color.rgb = SLATE_LIGHT

    # Right Column (6 to 9) + Architecture Summary Card
    for i in range(4):
        num_title, desc, col = arch_flow[5 + i]
        y = 1.65 + i * 1.05
        add_card(s7, 6.8, y, 5.7, 0.92, BG_CARD, BORDER_SUBTLE)

        pill = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.95), Inches(y + 0.16), Inches(2.3), Inches(0.6))
        pill.fill.solid()
        pill.fill.fore_color.rgb = BG_CARD_LIGHT
        pill.line.color.rgb = col
        tf_p = pill.text_frame
        tf_p.vertical_anchor = MSO_ANCHOR.MIDDLE
        p_p = tf_p.paragraphs[0]
        p_p.alignment = PP_ALIGN.CENTER
        r_p = p_p.add_run()
        r_p.text = num_title
        r_p.font.name = "Segoe UI"
        r_p.font.size = Pt(9.5)
        r_p.font.bold = True
        r_p.font.color.rgb = col

        tb_d = s7.shapes.add_textbox(Inches(9.35), Inches(y + 0.12), Inches(3.0), Inches(0.7))
        tf_d = tb_d.text_frame
        tf_d.word_wrap = True
        p_d = tf_d.paragraphs[0]
        r_d = p_d.add_run()
        r_d.text = desc
        r_d.font.name = "Segoe UI"
        r_d.font.size = Pt(9.5)
        r_d.font.color.rgb = SLATE_LIGHT

    # Architecture Summary Bottom Card
    add_card(s7, 6.8, 5.85, 5.7, 1.15, BG_CARD_LIGHT, EMERALD_BORDER)
    tb_sum = s7.shapes.add_textbox(Inches(7.05), Inches(5.95), Inches(5.2), Inches(0.95))
    tf_sum = tb_sum.text_frame
    tf_sum.word_wrap = True
    p = tf_sum.paragraphs[0]
    r = p.add_run()
    r.text = "Key Architectural Feature: "
    r.font.name = "Segoe UI"
    r.font.size = Pt(10)
    r.font.bold = True
    r.font.color.rgb = EMERALD
    r2 = p.add_run()
    r2.text = "Every component is modular and decoupled. When a user creates a shipment, it passes through the business manager, into transaction validation, through hashing and mining, directly into immutable storage, and becomes instantly visible on the explorer."
    r2.font.name = "Segoe UI"
    r2.font.size = Pt(9.5)
    r2.font.color.rgb = WHITE

    add_notes(s7, """
Our system architecture directly maps to the complete lifecycle of a shipment.
First, a user interacts with the Eco Chain Shipping Web Application.
Next, the Shipment Management module creates and tracks the shipping record.
This passes to the Transaction Layer, which converts status updates into signed transactions.
The Blockchain Layer bundles these transactions, computes SHA-256 hashes, and builds a Merkle Tree.
Then, the Proof of Work engine mines the block by finding a valid nonce.
Once mined, the block is committed to Blockchain Storage and immediately displayed in the Blockchain Explorer.
""")

    # =========================================================================
    # SLIDE 8: 12 BLOCKCHAIN CONCEPTS IMPLEMENTED
    # =========================================================================
    s8 = prs.slides.add_slide(blank_layout)
    set_slide_background(s8)
    add_header(s8, "Curriculum Alignment", "12 Blockchain Concepts Implemented", "Comprehensive mapping of all required blockchain fundamentals verified in the codebase")

    concepts = [
        ("01", "Hello Blockchain", "Genesis block initialization & visual ledger UI", EMERALD),
        ("02", "Hash Generation", "SHA-256 algorithm with avalanche effect simulator", CYAN),
        ("03", "Block Class Creation", "OOP Block model (index, timestamp, data, hashes, nonce)", WHITE),
        ("04", "Create Blockchain", "Sequential cryptographic block linkage from Genesis", EMERALD),
        ("05", "Validate Blockchain", "Cryptographic integrity audits & Tamper Lab diagnostics", RED),
        ("06", "Proof of Work (Mining)", "Target difficulty hashing with nonce counter & rewards", AMBER),
        ("07", "Simple Wallet", "Asymmetric demo keys (0x addresses & private keys)", CYAN),
        ("08", "Basic Transaction", "P2P EcoCoin transfers & unconfirmed mempool queue", WHITE),
        ("09", "Transaction Validation", "5-rule verification (balances, positive amounts, IDs)", EMERALD),
        ("10", "Merkle Tree", "Pairwise binary transaction hashing & odd-leaf handling", CYAN),
        ("11", "Smart Contract Simulation", "Logistics state machine & automated escrow disbursement", AMBER),
        ("12", "Mini Blockchain Explorer", "Deep block/transaction search & raw cryptographic auditor", WHITE)
    ]

    for i, (num, c_title, c_desc, c_acc) in enumerate(concepts):
        row = i // 4
        col = i % 4
        x = 0.8 + col * 2.95
        y = 1.7 + row * 1.65
        add_card(s8, x, y, 2.8, 1.45, BG_CARD, BORDER_SUBTLE)

        nchip = s8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(x + 0.15), Inches(y + 0.15), Inches(0.45), Inches(0.35))
        nchip.fill.solid()
        nchip.fill.fore_color.rgb = BG_CARD_LIGHT
        nchip.line.color.rgb = c_acc
        tf_nc = nchip.text_frame
        tf_nc.vertical_anchor = MSO_ANCHOR.MIDDLE
        p_nc = tf_nc.paragraphs[0]
        p_nc.alignment = PP_ALIGN.CENTER
        r_nc = p_nc.add_run()
        r_nc.text = num
        r_nc.font.name = "Segoe UI"
        r_nc.font.size = Pt(9.5)
        r_nc.font.bold = True
        r_nc.font.color.rgb = c_acc

        tb_c = s8.shapes.add_textbox(Inches(x + 0.68), Inches(y + 0.12), Inches(2.0), Inches(1.2))
        tf_c = tb_c.text_frame
        tf_c.word_wrap = True

        p = tf_c.paragraphs[0]
        r = p.add_run()
        r.text = c_title
        r.font.name = "Segoe UI"
        r.font.size = Pt(10.5)
        r.font.bold = True
        r.font.color.rgb = WHITE

        p_d = tf_c.add_paragraph()
        p_d.space_before = Pt(3)
        r_d = p_d.add_run()
        r_d.text = c_desc
        r_d.font.name = "Segoe UI"
        r_d.font.size = Pt(8.5)
        r_d.font.color.rgb = SLATE_LIGHT

    add_card(s8, 0.8, 6.7, 11.7, 0.5, BG_CARD_LIGHT, EMERALD_BORDER)
    tb_t = s8.shapes.add_textbox(Inches(1.05), Inches(6.72), Inches(11.2), Inches(0.45))
    tf_t = tb_t.text_frame
    tf_t.word_wrap = True
    p = tf_t.paragraphs[0]
    r1 = p.add_run()
    r1.text = "Automated Test Suite Verified: "
    r1.font.name = "Segoe UI"
    r1.font.size = Pt(9.5)
    r1.font.bold = True
    r1.font.color.rgb = EMERALD
    r2 = p.add_run()
    r2.text = "All 12 concepts are backed by automated tests (tests/blockchain.test.js) with 40 out of 40 unit assertions passing successfully."
    r2.font.name = "Segoe UI"
    r2.font.size = Pt(9.5)
    r2.font.color.rgb = WHITE

    add_notes(s8, """
This slide provides an overview of all twelve blockchain concepts implemented in Eco Chain Shipping.
They range from foundational concepts like Hello Blockchain, SHA-256 hash generation, and block class design, to core consensus and mining, wallets, and transactions.
We also implemented transaction validation, binary Merkle trees, a simulated shipping smart contract, and a mini blockchain explorer.
Every concept is operational in our live web application and backed by an automated 40-test verification suite.
We will now explain the most critical concepts in detail.
""")

    # =========================================================================
    # SLIDE 9: BLOCK & BLOCKCHAIN
    # =========================================================================
    s9 = prs.slides.add_slide(blank_layout)
    set_slide_background(s9)
    add_header(s9, "Data Structures", "Block Anatomy & Cryptographic Chain Linkage", "How individual blocks store data and link together through previous hashes")

    # Left: Block Anatomy Card
    add_card(s9, 0.8, 1.65, 4.5, 5.4, BG_CARD, BORDER_SUBTLE)
    tb_ba = s9.shapes.add_textbox(Inches(1.05), Inches(1.8), Inches(4.0), Inches(5.1))
    tf_ba = tb_ba.text_frame
    tf_ba.word_wrap = True

    p = tf_ba.paragraphs[0]
    r = p.add_run()
    r.text = "A BLOCK CONTAINS:"
    r.font.name = "Segoe UI"
    r.font.size = Pt(12)
    r.font.bold = True
    r.font.color.rgb = CYAN

    block_props = [
        ("Index", "Sequential block number (0, 1, 2, 3...)"),
        ("Timestamp", "Exact date & time when the block was mined"),
        ("Data", "Shipment details, cargo weight, and transactions"),
        ("Previous Hash", "64-char hash of previous block (creates the chain)"),
        ("Hash", "Unique SHA-256 cryptographic fingerprint of this block"),
        ("Nonce", "Number used once; counter solved during mining")
    ]

    for prop, pdesc in block_props:
        p = tf_ba.add_paragraph()
        p.space_before = Pt(6)
        r_p = p.add_run()
        r_p.text = f"• {prop}: "
        r_p.font.name = "Segoe UI"
        r_p.font.size = Pt(10)
        r_p.font.bold = True
        r_p.font.color.rgb = EMERALD
        r_d = p.add_run()
        r_d.text = pdesc
        r_d.font.name = "Segoe UI"
        r_d.font.size = Pt(9.5)
        r_d.font.color.rgb = SLATE_LIGHT

    # Right: Chained Blocks Diagram (Genesis Block -> Block 1 -> Block 2 -> Block 3)
    add_card(s9, 5.6, 1.65, 6.9, 5.4, BG_CARD, BORDER_SUBTLE)
    tb_chain_t = s9.shapes.add_textbox(Inches(5.85), Inches(1.8), Inches(6.4), Inches(0.4))
    tf_ct = tb_chain_t.text_frame
    p = tf_ct.paragraphs[0]
    r = p.add_run()
    r.text = "HOW BLOCKS FORM AN UNBREAKABLE CHAIN"
    r.font.name = "Segoe UI"
    r.font.size = Pt(12)
    r.font.bold = True
    r.font.color.rgb = EMERALD

    blocks_demo = [
        ("GENESIS BLOCK #0", "0", "00a4f8...b7", "Eco Chain Genesis Block", 0, EMERALD),
        ("BLOCK 1", "00a4f8...b7", "008b2c...9e", "Shipment SHP-101: Solar Panels", 165, CYAN),
        ("BLOCK 2", "008b2c...9e", "00c31d...4a", "Shipment SHP-102: Wind Turbines", 412, CYAN),
        ("BLOCK 3", "00c31d...4a", "009e4f...18", "Shipment SHP-103: Battery Units", 289, CYAN)
    ]

    for i, (b_name, b_prev, b_hash, b_data, b_nonce, b_acc) in enumerate(blocks_demo):
        y = 2.25 + i * 1.15
        add_card(s9, 5.85, y, 6.4, 0.9, BG_CARD_LIGHT, BORDER_SUBTLE)

        tb_b = s9.shapes.add_textbox(Inches(6.0), Inches(y + 0.05), Inches(6.1), Inches(0.8))
        tf_b = tb_b.text_frame
        tf_b.word_wrap = True

        p = tf_b.paragraphs[0]
        r = p.add_run()
        r.text = f"{b_name}   "
        r.font.name = "Segoe UI"
        r.font.size = Pt(10)
        r.font.bold = True
        r.font.color.rgb = b_acc
        r_n = p.add_run()
        r_n.text = f"Nonce: {b_nonce}   |   Data: {b_data}"
        r_n.font.name = "Segoe UI"
        r_n.font.size = Pt(8.5)
        r_n.font.color.rgb = SLATE_MUTED

        p2 = tf_b.add_paragraph()
        r2_1 = p2.add_run()
        r2_1.text = "Prev Hash: "
        r2_1.font.name = "Segoe UI"
        r2_1.font.size = Pt(9)
        r2_1.font.bold = True
        r2_1.font.color.rgb = SLATE_MUTED
        r2_2 = p2.add_run()
        r2_2.text = f"{b_prev}   "
        r2_2.font.name = "Consolas"
        r2_2.font.size = Pt(9.5)
        r2_2.font.color.rgb = CYAN if b_prev != "0" else SLATE_MUTED

        r2_3 = p2.add_run()
        r2_3.text = "➔   Current Hash: "
        r2_3.font.name = "Segoe UI"
        r2_3.font.size = Pt(9)
        r2_3.font.bold = True
        r2_3.font.color.rgb = SLATE_MUTED
        r2_4 = p2.add_run()
        r2_4.text = b_hash
        r2_4.font.name = "Consolas"
        r2_4.font.size = Pt(9.5)
        r2_4.font.color.rgb = EMERALD

        # Down arrow connector centered neatly
        if i < 3:
            arr_box = s9.shapes.add_textbox(Inches(8.3), Inches(y + 0.85), Inches(1.5), Inches(0.28))
            tf_a = arr_box.text_frame
            tf_a.margin_left = tf_a.margin_top = tf_a.margin_right = tf_a.margin_bottom = 0
            p_a = tf_a.paragraphs[0]
            p_a.alignment = PP_ALIGN.CENTER
            r_a = p_a.add_run()
            r_a.text = "↓ previousHash"
            r_a.font.name = "Segoe UI"
            r_a.font.size = Pt(8.5)
            r_a.font.bold = True
            r_a.font.color.rgb = EMERALD

    add_notes(s9, """
On this slide, we examine what a block contains and how blocks connect to form a blockchain.
Each block has six core fields: Index, Timestamp, Data, Previous Hash, Hash, and Nonce.
The chain starts with the Genesis Block, which has index zero and a previous hash of zero.
Every new block stores the exact hash of the preceding block in its 'previousHash' field.
For example, Block 1 stores Genesis Block's hash, and Block 2 stores Block 1's hash.
This creates a continuous cryptographic link from the newest block all the way back to the Genesis block.
""")

    # =========================================================================
    # SLIDE 10: HASHING & BLOCKCHAIN VALIDATION (TAMPER LAB)
    # =========================================================================
    s10 = prs.slides.add_slide(blank_layout)
    set_slide_background(s10)
    add_header(s10, "Cryptographic Security", "Hashing & Blockchain Validation", "How SHA-256 hashing and link verification immediately detect data manipulation")

    # Top: SHA-256 Process visual
    add_card(s10, 0.8, 1.65, 11.7, 1.15, BG_CARD, BORDER_SUBTLE)
    tb_sha = s10.shapes.add_textbox(Inches(1.05), Inches(1.72), Inches(11.2), Inches(1.0))
    tf_sha = tb_sha.text_frame
    tf_sha.word_wrap = True

    p = tf_sha.paragraphs[0]
    r = p.add_run()
    r.text = "SHA-256 HASHING MECHANISM"
    r.font.name = "Segoe UI"
    r.font.size = Pt(11)
    r.font.bold = True
    r.font.color.rgb = CYAN

    p_p = tf_sha.add_paragraph()
    r = p_p.add_run()
    r.text = "Input Data  ──[ SHA-256 Cryptographic Algorithm ]──▶  Fixed 64-Character Hexadecimal Hash\n"
    r.font.name = "Consolas"
    r.font.size = Pt(10)
    r.font.bold = True
    r.font.color.rgb = WHITE
    r2 = p_p.add_run()
    r2.text = "SHA-256 is deterministic and irreversible. Changing even 1 character alters over 50% of the output characters (Avalanche Effect)."
    r2.font.name = "Segoe UI"
    r2.font.size = Pt(9.5)
    r2.font.color.rgb = SLATE_LIGHT

    # Middle: If block data changes sequence
    flow_tamper = [
        ("1. Data Changes", "Attacker modifies cargo amount", RED),
        ("2. Hash Changes", "SHA-256 digest recalculates completely", AMBER),
        ("3. Link Breaks", "Next block's prevHash fails to match", RED),
        ("4. Invalid Chain", "Validation engine flags corruption", RED)
    ]
    for i, (t_title, t_desc, t_col) in enumerate(flow_tamper):
        x = 0.8 + i * 2.95
        add_card(s10, x, 2.95, 2.8, 0.75, BG_CARD_LIGHT, t_col)
        tb_ft = s10.shapes.add_textbox(Inches(x + 0.1), Inches(3.0), Inches(2.6), Inches(0.65))
        tf_ft = tb_ft.text_frame
        tf_ft.word_wrap = True
        p_ft = tf_ft.paragraphs[0]
        r_ft = p_ft.add_run()
        r_ft.text = t_title + "\n"
        r_ft.font.name = "Segoe UI"
        r_ft.font.size = Pt(9.5)
        r_ft.font.bold = True
        r_ft.font.color.rgb = t_col
        r_fd = p_ft.add_run()
        r_fd.text = t_desc
        r_fd.font.name = "Segoe UI"
        r_fd.font.size = Pt(8.5)
        r_fd.font.color.rgb = WHITE

    # Bottom: Side-by-Side Tamper Demonstration (Original vs Tampered)
    # Left Box: Original Valid Chain (Green)
    add_card(s10, 0.8, 3.85, 5.7, 3.25, BG_CARD, EMERALD_BORDER, border_width=1.5)
    tb_orig = s10.shapes.add_textbox(Inches(1.05), Inches(3.95), Inches(5.2), Inches(2.3))
    tf_orig = tb_orig.text_frame
    tf_orig.word_wrap = True

    p = tf_orig.paragraphs[0]
    r = p.add_run()
    r.text = "ORIGINAL BLOCK DATA (VALID ✔)"
    r.font.name = "Segoe UI"
    r.font.size = Pt(11)
    r.font.bold = True
    r.font.color.rgb = EMERALD

    orig_lines = [
        ("Block #1 Cargo Data:", "Amount = 100 EcoCoins"),
        ("Block #1 Hash:", "007a4b9ef18c23... (Valid PoW)"),
        ("Block #2 Prev Hash:", "007a4b9ef18c23... (Exact Match ✔)"),
        ("Validation Check:", "Calculated Hash === Stored Hash ✔")
    ]
    for lbl, val in orig_lines:
        p = tf_orig.add_paragraph()
        p.space_before = Pt(3)
        r_l = p.add_run()
        r_l.text = f"{lbl} "
        r_l.font.name = "Segoe UI"
        r_l.font.size = Pt(9.5)
        r_l.font.bold = True
        r_l.font.color.rgb = SLATE_MUTED
        r_v = p.add_run()
        r_v.text = val
        r_v.font.name = "Consolas" if "Hash" in lbl or "Amount" in val else "Segoe UI"
        r_v.font.size = Pt(9.5)
        r_v.font.color.rgb = EMERALD if "✔" in val else WHITE

    # Result Banner Left
    rbox_l = s10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.05), Inches(6.35), Inches(5.2), Inches(0.55))
    rbox_l.fill.solid()
    rbox_l.fill.fore_color.rgb = EMERALD_BG
    rbox_l.line.color.rgb = EMERALD
    tf_rl = rbox_l.text_frame
    tf_rl.vertical_anchor = MSO_ANCHOR.MIDDLE
    p_rl = tf_rl.paragraphs[0]
    p_rl.alignment = PP_ALIGN.CENTER
    r_rl = p_rl.add_run()
    r_rl.text = "Result: ✔ Blockchain Valid (100% Integrity Confirmed)"
    r_rl.font.name = "Segoe UI"
    r_rl.font.size = Pt(10)
    r_rl.font.bold = True
    r_rl.font.color.rgb = WHITE

    # Right Box: Tampered Chain (Red)
    add_card(s10, 6.8, 3.85, 5.7, 3.25, BG_CARD, RED_BORDER, border_width=1.5)
    tb_tamp = s10.shapes.add_textbox(Inches(7.05), Inches(3.95), Inches(5.2), Inches(2.3))
    tf_tamp = tb_tamp.text_frame
    tf_tamp.word_wrap = True

    p = tf_tamp.paragraphs[0]
    r = p.add_run()
    r.text = "TAMPERED DATA (TAMPER DETECTED ❌)"
    r.font.name = "Segoe UI"
    r.font.size = Pt(11)
    r.font.bold = True
    r.font.color.rgb = RED

    tamp_lines = [
        ("Tampered Cargo Data:", "Amount = 1000 EcoCoins (Altered!)"),
        ("Recalculated Hash:", "d94f281ae573... (Avalanche Flip)"),
        ("Block #2 Prev Hash:", "007a4b9ef18c23... (MISMATCH! ❌)"),
        ("Validation Check:", "Recalculated Hash ≠ Stored Hash ❌")
    ]
    for lbl, val in tamp_lines:
        p = tf_tamp.add_paragraph()
        p.space_before = Pt(3)
        r_l = p.add_run()
        r_l.text = f"{lbl} "
        r_l.font.name = "Segoe UI"
        r_l.font.size = Pt(9.5)
        r_l.font.bold = True
        r_l.font.color.rgb = SLATE_MUTED
        r_v = p.add_run()
        r_v.text = val
        r_v.font.name = "Consolas" if "Hash" in lbl or "Amount" in val else "Segoe UI"
        r_v.font.size = Pt(9.5)
        r_v.font.color.rgb = RED if "❌" in val or "Altered" in val or "MISMATCH" in val else WHITE

    # Result Banner Right
    rbox_r = s10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(7.05), Inches(6.35), Inches(5.2), Inches(0.55))
    rbox_r.fill.solid()
    rbox_r.fill.fore_color.rgb = RED_BG
    rbox_r.line.color.rgb = RED
    tf_rr = rbox_r.text_frame
    tf_rr.vertical_anchor = MSO_ANCHOR.MIDDLE
    p_rr = tf_rr.paragraphs[0]
    p_rr.alignment = PP_ALIGN.CENTER
    r_rr = p_rr.add_run()
    r_rr.text = "Result: ❌ Blockchain Invalid (Tampering Detected & Blocked)"
    r_rr.font.name = "Segoe UI"
    r_rr.font.size = Pt(10)
    r_rr.font.bold = True
    r_rr.font.color.rgb = WHITE

    add_notes(s10, """
Slide 10 demonstrates how blockchain detects tampering using SHA-256 hashing.
Input data passes through SHA-256 to generate a unique hash fingerprint.
If an attacker attempts to tamper with data—for example, changing the shipment amount from 100 to 1000 EcoCoins—the block's hash changes completely.
Because Block 2 still stores the original hash, the connection breaks immediately.
Our validation function recalculates all hashes and immediately flags the entire chain as invalid, preventing fraudulent records from succeeding.
""")

    # =========================================================================
    # SLIDE 11: PROOF OF WORK / MINING
    # =========================================================================
    s11 = prs.slides.add_slide(blank_layout)
    set_slide_background(s11)
    add_header(s11, "Consensus Mechanism", "Proof of Work (PoW) & Mining", "How computational puzzles prevent fraudulent blocks and secure the distributed ledger")

    # Left: Mining Mechanics & Flowchart
    add_card(s11, 0.8, 1.65, 5.7, 5.45, BG_CARD, BORDER_SUBTLE)
    tb_mf = s11.shapes.add_textbox(Inches(1.05), Inches(1.8), Inches(5.2), Inches(5.1))
    tf_mf = tb_mf.text_frame
    tf_mf.word_wrap = True

    p = tf_mf.paragraphs[0]
    r = p.add_run()
    r.text = "HOW MINING WORKS"
    r.font.name = "Segoe UI"
    r.font.size = Pt(11.5)
    r.font.bold = True
    r.font.color.rgb = AMBER

    flow_items = [
        ("1. Purpose of Mining:", "Mining is used to find a valid block hash that satisfies the network."),
        ("2. Nonce Adjustment:", "The miner changes the nonce counter on each iteration starting at 0."),
        ("3. SHA-256 Calculation:", "Block Data + Nonce ➔ Computed SHA-256 Hash."),
        ("4. Check Difficulty:", "Does the hash meet the required number of leading zeros?"),
        ("5. Valid Hash Decision:", "If No ➔ Increment Nonce (nonce++) and repeat hashing loop."),
        ("6. Yes ➔ Block Added:", "Once valid hash is found, the block is permanently added to chain.")
    ]
    for step_title, step_desc in flow_items:
        p = tf_mf.add_paragraph()
        p.space_before = Pt(6)
        r_st = p.add_run()
        r_st.text = f"{step_title}\n"
        r_st.font.name = "Segoe UI"
        r_st.font.size = Pt(10)
        r_st.font.bold = True
        r_st.font.color.rgb = WHITE
        r_sd = p.add_run()
        r_sd.text = step_desc
        r_sd.font.name = "Segoe UI"
        r_sd.font.size = Pt(9.5)
        r_sd.font.color.rgb = SLATE_LIGHT

    # Right: Difficulty Requirement & Lab Example
    add_card(s11, 6.8, 1.65, 5.7, 2.5, BG_CARD, BORDER_SUBTLE)
    tb_diff = s11.shapes.add_textbox(Inches(7.05), Inches(1.8), Inches(5.2), Inches(2.2))
    tf_diff = tb_diff.text_frame
    tf_diff.word_wrap = True

    p = tf_diff.paragraphs[0]
    r = p.add_run()
    r.text = "DIFFICULTY REQUIREMENT & TARGET MASK"
    r.font.name = "Segoe UI"
    r.font.size = Pt(11.5)
    r.font.bold = True
    r.font.color.rgb = EMERALD

    p_df = tf_diff.add_paragraph()
    p_df.space_before = Pt(6)
    r = p_df.add_run()
    r.text = "• The hash must satisfy the difficulty requirement.\n• For example, Difficulty = 4 requires 4 leading zeros:\n"
    r.font.name = "Segoe UI"
    r.font.size = Pt(9.5)
    r.font.color.rgb = SLATE_LIGHT

    mask_box = s11.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(7.05), Inches(2.75), Inches(5.2), Inches(0.55))
    mask_box.fill.solid()
    mask_box.fill.fore_color.rgb = BG_CARD_LIGHT
    mask_box.line.color.rgb = AMBER
    tf_mb = mask_box.text_frame
    tf_mb.vertical_anchor = MSO_ANCHOR.MIDDLE
    p_mb = tf_mb.paragraphs[0]
    p_mb.alignment = PP_ALIGN.CENTER
    r_mb = p_mb.add_run()
    r_mb.text = "Required: 0000xxxxxxxxxxxxxxxxxxxxxxxx"
    r_mb.font.name = "Consolas"
    r_mb.font.size = Pt(11)
    r_mb.font.bold = True
    r_mb.font.color.rgb = AMBER

    add_card(s11, 6.8, 4.3, 5.7, 2.8, BG_CARD_LIGHT, AMBER_BG)
    tb_ex = s11.shapes.add_textbox(Inches(7.05), Inches(4.45), Inches(5.2), Inches(2.5))
    tf_ex = tb_ex.text_frame
    tf_ex.word_wrap = True

    p = tf_ex.paragraphs[0]
    r = p.add_run()
    r.text = "LIVE MINING EXECUTION IN ECO CHAIN"
    r.font.name = "Segoe UI"
    r.font.size = Pt(11)
    r.font.bold = True
    r.font.color.rgb = AMBER

    metrics = [
        ("Configured Difficulty:", "Difficulty = 2 (Prefix: '00')"),
        ("Winning Nonce Found:", "Nonce = 165 iterations"),
        ("Resulting Hash:", "003b1a78e4f19b26c04d88e7..."),
        ("Mining Reward:", "+50 EcoCoins awarded to miner wallet"),
        ("Security Impact:", "Attacker cannot rewrite history without re-mining every single block!")
    ]
    for ml, mv in metrics:
        p = tf_ex.add_paragraph()
        p.space_before = Pt(3)
        r_ml = p.add_run()
        r_ml.text = f"{ml} "
        r_ml.font.name = "Segoe UI"
        r_ml.font.size = Pt(9.5)
        r_ml.font.bold = True
        r_ml.font.color.rgb = SLATE_MUTED
        r_mv = p.add_run()
        r_mv.text = mv
        r_mv.font.name = "Consolas" if "Hash" in ml or "Nonce" in mv else "Segoe UI"
        r_mv.font.size = Pt(9.5)
        r_mv.font.color.rgb = EMERALD if "+" in mv else WHITE

    add_notes(s11, """
Proof of Work is the consensus mechanism that prevents spam and protects the blockchain from being rewritten.
Mining is used to find a valid block hash by changing the nonce counter.
The resulting hash must satisfy the difficulty requirement—for example, difficulty 4 means the hash must start with four leading zeros.
The mining cycle computes SHA-256 with the current nonce; if the hash does not match, the nonce is incremented and checked again.
Once a valid hash is found, the block is officially added to the blockchain, and the miner receives a 50 EcoCoin simulation reward.
""")

    # =========================================================================
    # SLIDE 12: WALLET & TRANSACTIONS
    # =========================================================================
    s12 = prs.slides.add_slide(blank_layout)
    set_slide_background(s12)
    add_header(s12, "Identity & Transfer Validation", "Wallet & Transactions", "Wallet structure, transfer lifecycle, and strict 4-point transaction validation")

    # Left: Wallet Architecture & Academic Disclaimer
    add_card(s12, 0.8, 1.65, 5.7, 5.45, BG_CARD, BORDER_SUBTLE)
    tb_w = s12.shapes.add_textbox(Inches(1.05), Inches(1.8), Inches(5.2), Inches(5.1))
    tf_w = tb_w.text_frame
    tf_w.word_wrap = True

    p = tf_w.paragraphs[0]
    r = p.add_run()
    r.text = "WALLET STRUCTURE"
    r.font.name = "Segoe UI"
    r.font.size = Pt(11.5)
    r.font.bold = True
    r.font.color.rgb = CYAN

    w_fields = [
        ("Wallet ID:", "Identifies entity (e.g., 'Green Freight Logistics')"),
        ("Wallet Address:", "0x4F92A7... (Public address for receiving funds)"),
        ("Balance:", "Current balance in EcoCoins (e.g., 1,500 ECO)")
    ]
    for wl, wv in w_fields:
        p = tf_w.add_paragraph()
        p.space_before = Pt(4)
        r_l = p.add_run()
        r_l.text = f"{wl} "
        r_l.font.name = "Segoe UI"
        r_l.font.size = Pt(10)
        r_l.font.bold = True
        r_l.font.color.rgb = SLATE_MUTED
        r_v = p.add_run()
        r_v.text = wv
        r_v.font.name = "Consolas" if "0x" in wv else "Segoe UI"
        r_v.font.size = Pt(9.5)
        r_v.font.color.rgb = WHITE

    # Transaction Flow Visual Box
    add_card(s12, 1.05, 3.4, 5.2, 1.65, BG_CARD_LIGHT, CYAN_BORDER)
    tb_txex = s12.shapes.add_textbox(Inches(1.2), Inches(3.5), Inches(4.9), Inches(1.45))
    tf_txex = tb_txex.text_frame
    tf_txex.word_wrap = True
    p = tf_txex.paragraphs[0]
    r = p.add_run()
    r.text = "TRANSACTION STRUCTURE & FLOW"
    r.font.name = "Segoe UI"
    r.font.size = Pt(10)
    r.font.bold = True
    r.font.color.rgb = CYAN

    p_flow = tf_txex.add_paragraph()
    p_flow.space_before = Pt(2)
    r = p_flow.add_run()
    r.text = "Sender ➔ Receiver ➔ Amount ➔ Timestamp\n"
    r.font.name = "Segoe UI"
    r.font.size = Pt(10)
    r.font.bold = True
    r.font.color.rgb = WHITE

    p_ex = tf_txex.add_paragraph()
    r_ex = p_ex.add_run()
    r_ex.text = "Example: Wallet A ──[ 100 EcoCoins ]──▶ Wallet B\nRecorded with transaction ID & timestamp into mempool."
    r_ex.font.name = "Segoe UI"
    r_ex.font.size = Pt(9)
    r_ex.font.color.rgb = SLATE_LIGHT

    # Explicit Simulation Disclaimer requested by user
    add_card(s12, 1.05, 5.2, 5.2, 1.65, BG_CARD_INNER, AMBER_BG)
    tb_disc = s12.shapes.add_textbox(Inches(1.2), Inches(5.3), Inches(4.9), Inches(1.45))
    tf_disc = tb_disc.text_frame
    tf_disc.word_wrap = True
    p = tf_disc.paragraphs[0]
    r_d1 = p.add_run()
    r_d1.text = "⚠️ IMPORTANT SIMULATION NOTICE:\n"
    r_d1.font.name = "Segoe UI"
    r_d1.font.size = Pt(10)
    r_d1.font.bold = True
    r_d1.font.color.rgb = AMBER
    r_d2 = p.add_run()
    r_d2.text = "EcoCoins are only demo/simulation data and are not real cryptocurrency. They have no monetary value and are used purely for educational demonstration of blockchain transactions."
    r_d2.font.name = "Segoe UI"
    r_d2.font.size = Pt(9.5)
    r_d2.font.color.rgb = WHITE

    # Right: Transaction Validation Checklist
    add_card(s12, 6.8, 1.65, 5.7, 5.45, BG_CARD, BORDER_SUBTLE)
    tb_val = s12.shapes.add_textbox(Inches(7.05), Inches(1.8), Inches(5.2), Inches(5.1))
    tf_val = tb_val.text_frame
    tf_val.word_wrap = True

    p = tf_val.paragraphs[0]
    r = p.add_run()
    r.text = "TRANSACTION VALIDATION"
    r.font.name = "Segoe UI"
    r.font.size = Pt(11.5)
    r.font.bold = True
    r.font.color.rgb = EMERALD

    p_vs = tf_val.add_paragraph()
    p_vs.space_before = Pt(3)
    r = p_vs.add_run()
    r.text = "Before any transaction can enter the mempool or be mined into a block, our validation engine verifies 4 strict conditions:"
    r.font.name = "Segoe UI"
    r.font.size = Pt(10)
    r.font.color.rgb = SLATE_LIGHT

    rules = [
        ("Sender Exists", "Verifies that the sender wallet is registered in the system registry.", EMERALD),
        ("Receiver Exists", "Verifies that the recipient wallet is registered and distinct.", EMERALD),
        ("Amount is Valid", "Ensures the transfer amount is positive and greater than zero (amount > 0).", CYAN),
        ("Sender has Sufficient Balance", "Confirms sender's balance is sufficient (balance >= amount), preventing overdrafts.", CYAN)
    ]
    for r_title, r_desc, r_col in rules:
        p = tf_val.add_paragraph()
        p.space_before = Pt(8)
        r_t = p.add_run()
        r_t.text = f"✔ {r_title}\n"
        r_t.font.name = "Segoe UI"
        r_t.font.size = Pt(10.5)
        r_t.font.bold = True
        r_t.font.color.rgb = r_col
        r_d = p.add_run()
        r_d.text = r_desc
        r_d.font.name = "Segoe UI"
        r_d.font.size = Pt(9.5)
        r_d.font.color.rgb = SLATE_LIGHT

    add_notes(s12, """
In this slide, we explain our wallet and transaction system.
A wallet consists of a Wallet ID, a public Wallet Address, and an EcoCoin Balance.
A transaction records Sender, Receiver, Amount, and Timestamp, such as Wallet A transferring 100 EcoCoins to Wallet B.
We explicitly emphasize that EcoCoins are only simulation data and are not real cryptocurrency.
Furthermore, every transaction must pass validation: confirming the sender exists, the receiver exists, the amount is valid and positive, and the sender has sufficient balance.
""")

    # =========================================================================
    # SLIDE 13: MERKLE TREE & SMART CONTRACT
    # =========================================================================
    s13 = prs.slides.add_slide(blank_layout)
    set_slide_background(s13)
    add_header(s13, "Data Integrity & Automation", "Merkle Tree & Smart Contract Simulation", "Binary transaction hashing hierarchy and milestone-driven shipping escrow")

    # Left Section: MERKLE TREE
    add_card(s13, 0.8, 1.65, 5.7, 5.45, BG_CARD, BORDER_SUBTLE)
    tb_mt = s13.shapes.add_textbox(Inches(1.05), Inches(1.8), Inches(5.2), Inches(0.85))
    tf_mt = tb_mt.text_frame
    tf_mt.word_wrap = True

    p = tf_mt.paragraphs[0]
    r = p.add_run()
    r.text = "MERKLE TREE"
    r.font.name = "Segoe UI"
    r.font.size = Pt(12)
    r.font.bold = True
    r.font.color.rgb = CYAN

    p_sub = tf_mt.add_paragraph()
    r = p_sub.add_run()
    r.text = "Merkle Root represents all transactions inside a block."
    r.font.name = "Segoe UI"
    r.font.size = Pt(10)
    r.font.color.rgb = SLATE_LIGHT

    # Merkle Root Box (Top)
    r_box = s13.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(2.2), Inches(2.6), Inches(2.9), Inches(0.48))
    r_box.fill.solid()
    r_box.fill.fore_color.rgb = BG_CARD_LIGHT
    r_box.line.color.rgb = CYAN
    r_box.line.width = Pt(1.5)
    tf_rb = r_box.text_frame
    tf_rb.vertical_anchor = MSO_ANCHOR.MIDDLE
    p_rb = tf_rb.paragraphs[0]
    p_rb.alignment = PP_ALIGN.CENTER
    r_rb = p_rb.add_run()
    r_rb.text = "MERKLE ROOT"
    r_rb.font.name = "Segoe UI"
    r_rb.font.size = Pt(10.5)
    r_rb.font.bold = True
    r_rb.font.color.rgb = CYAN

    # Connector Lines: from Root down to Hash 12 and Hash 34
    arr1 = s13.shapes.add_textbox(Inches(2.1), Inches(3.1), Inches(1.0), Inches(0.35))
    arr1.text_frame.margin_left = arr1.text_frame.margin_top = arr1.text_frame.margin_right = arr1.text_frame.margin_bottom = 0
    p_a1 = arr1.text_frame.paragraphs[0]
    p_a1.alignment = PP_ALIGN.CENTER
    r_a1 = p_a1.add_run()
    r_a1.text = "▲\n│"
    r_a1.font.name = "Consolas"
    r_a1.font.size = Pt(9)
    r_a1.font.color.rgb = SLATE_MUTED

    arr2 = s13.shapes.add_textbox(Inches(4.2), Inches(3.1), Inches(1.0), Inches(0.35))
    arr2.text_frame.margin_left = arr2.text_frame.margin_top = arr2.text_frame.margin_right = arr2.text_frame.margin_bottom = 0
    p_a2 = arr2.text_frame.paragraphs[0]
    p_a2.alignment = PP_ALIGN.CENTER
    r_a2 = p_a2.add_run()
    r_a2.text = "▲\n│"
    r_a2.font.name = "Consolas"
    r_a2.font.size = Pt(9)
    r_a2.font.color.rgb = SLATE_MUTED

    # Level 1 Boxes: Hash 12 and Hash 34
    h12 = s13.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.2), Inches(3.5), Inches(2.2), Inches(0.45))
    h12.fill.solid()
    h12.fill.fore_color.rgb = BG_CARD_LIGHT
    h12.line.color.rgb = WHITE
    tf_h12 = h12.text_frame
    tf_h12.vertical_anchor = MSO_ANCHOR.MIDDLE
    p_h12 = tf_h12.paragraphs[0]
    p_h12.alignment = PP_ALIGN.CENTER
    r_h12 = p_h12.add_run()
    r_h12.text = "Hash 12"
    r_h12.font.name = "Segoe UI"
    r_h12.font.size = Pt(9.5)
    r_h12.font.bold = True
    r_h12.font.color.rgb = WHITE

    h34 = s13.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(3.9), Inches(3.5), Inches(2.2), Inches(0.45))
    h34.fill.solid()
    h34.fill.fore_color.rgb = BG_CARD_LIGHT
    h34.line.color.rgb = WHITE
    tf_h34 = h34.text_frame
    tf_h34.vertical_anchor = MSO_ANCHOR.MIDDLE
    p_h34 = tf_h34.paragraphs[0]
    p_h34.alignment = PP_ALIGN.CENTER
    r_h34 = p_h34.add_run()
    r_h34.text = "Hash 34"
    r_h34.font.name = "Segoe UI"
    r_h34.font.size = Pt(9.5)
    r_h34.font.bold = True
    r_h34.font.color.rgb = WHITE

    # Level 0 Leaves: Tx 1, Tx 2, Tx 3, Tx 4
    tx_leaves = [("Tx 1", 1.05), ("Tx 2", 2.25), ("Tx 3", 3.75), ("Tx 4", 4.95)]
    for tx_name, tx_x in tx_leaves:
        tx_b = s13.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(tx_x), Inches(4.35), Inches(1.1), Inches(0.42))
        tx_b.fill.solid()
        tx_b.fill.fore_color.rgb = BG_CARD_LIGHT
        tx_b.line.color.rgb = EMERALD
        tf_txb = tx_b.text_frame
        tf_txb.vertical_anchor = MSO_ANCHOR.MIDDLE
        p_tx = tf_txb.paragraphs[0]
        p_tx.alignment = PP_ALIGN.CENTER
        r_tx = p_tx.add_run()
        r_tx.text = tx_name
        r_tx.font.name = "Segoe UI"
        r_tx.font.size = Pt(9)
        r_tx.font.bold = True
        r_tx.font.color.rgb = EMERALD

    # Explanation card on left bottom
    add_card(s13, 1.05, 5.15, 5.2, 1.7, BG_CARD_LIGHT, BORDER_SUBTLE)
    tb_mtexp = s13.shapes.add_textbox(Inches(1.2), Inches(5.25), Inches(4.9), Inches(1.5))
    tf_me = tb_mtexp.text_frame
    tf_me.word_wrap = True
    p = tf_me.paragraphs[0]
    r = p.add_run()
    r.text = "How Merkle Tree Works:\n"
    r.font.name = "Segoe UI"
    r.font.size = Pt(9.5)
    r.font.bold = True
    r.font.color.rgb = CYAN
    r2 = p.add_run()
    r2.text = "• Tx 1 & Tx 2 are hashed together into Hash 12.\n• Tx 3 & Tx 4 are hashed together into Hash 34.\n• Hash 12 & Hash 34 combine into the Merkle Root.\n• If odd transactions exist (e.g. 3), last leaf is duplicated."
    r2.font.name = "Segoe UI"
    r2.font.size = Pt(8.5)
    r2.font.color.rgb = WHITE

    # Right Section: SMART CONTRACT SIMULATION
    add_card(s13, 6.8, 1.65, 5.7, 5.45, BG_CARD, BORDER_SUBTLE)
    tb_sc = s13.shapes.add_textbox(Inches(7.05), Inches(1.8), Inches(5.2), Inches(0.85))
    tf_sc = tb_sc.text_frame
    tf_sc.word_wrap = True

    p = tf_sc.paragraphs[0]
    r = p.add_run()
    r.text = "SMART CONTRACT SIMULATION"
    r.font.name = "Segoe UI"
    r.font.size = Pt(12)
    r.font.bold = True
    r.font.color.rgb = EMERALD

    p_scs = tf_sc.add_paragraph()
    r = p_scs.add_run()
    r.text = "Our project simulates shipping rules using a smart contract."
    r.font.name = "Segoe UI"
    r.font.size = Pt(10)
    r.font.color.rgb = SLATE_LIGHT

    # Smart Contract 5-Stage Ordered Pipeline
    sc_stages = [
        ("1. Pending", "Escrow funds locked from shipper; waiting for cargo pickup", WHITE),
        ("2. Picked Up", "Carrier collects freight at loading port; custody verified", CYAN),
        ("3. In Transit", "Cargo en route on maritime vessel; telemetry monitored", AMBER),
        ("4. Delivered", "Consignee confirms delivery receipt at destination port", EMERALD),
        ("5. Contract Completed", "Freight payment +25 ECO bonus released automatically!", EMERALD)
    ]
    for i, (st_name, st_desc, st_col) in enumerate(sc_stages):
        y = 2.65 + i * 0.68
        sbox = s13.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(7.05), Inches(y), Inches(5.2), Inches(0.55))
        sbox.fill.solid()
        sbox.fill.fore_color.rgb = BG_CARD_LIGHT
        sbox.line.color.rgb = st_col
        tf_sb = sbox.text_frame
        tf_sb.word_wrap = True
        tf_sb.vertical_anchor = MSO_ANCHOR.MIDDLE
        p_sb = tf_sb.paragraphs[0]
        r_sb1 = p_sb.add_run()
        r_sb1.text = f"{st_name}  ➔  "
        r_sb1.font.name = "Segoe UI"
        r_sb1.font.size = Pt(9.5)
        r_sb1.font.bold = True
        r_sb1.font.color.rgb = st_col
        r_sb2 = p_sb.add_run()
        r_sb2.text = st_desc
        r_sb2.font.name = "Segoe UI"
        r_sb2.font.size = Pt(8.5)
        r_sb2.font.color.rgb = WHITE

    # Smart contract enforcement rule card at bottom
    add_card(s13, 7.05, 6.2, 5.2, 0.65, BG_CARD_INNER, EMERALD_BORDER)
    tb_scr = s13.shapes.add_textbox(Inches(7.15), Inches(6.22), Inches(5.0), Inches(0.6))
    tf_scr = tb_scr.text_frame
    p = tf_scr.paragraphs[0]
    r = p.add_run()
    r.text = "Rule Enforcement: "
    r.font.name = "Segoe UI"
    r.font.size = Pt(9)
    r.font.bold = True
    r.font.color.rgb = EMERALD
    r2 = p.add_run()
    r2.text = "Skips (e.g., Pending ➔ Delivered) are automatically rejected by contract logic."
    r2.font.name = "Segoe UI"
    r2.font.size = Pt(9)
    r2.font.color.rgb = WHITE

    add_notes(s13, """
Slide 13 is divided into two sections.
On the left is the Merkle Tree: Transaction 1 and Transaction 2 combine to form Hash 12, while Transaction 3 and Transaction 4 combine to form Hash 34.
These two intermediate hashes are then hashed together to produce the Merkle Root, which securely represents all transactions inside a block.
On the right is our Smart Contract simulation.
It enforces the real-world shipping lifecycle: Pending, Picked Up, In Transit, Delivered, and Contract Completed.
The smart contract guarantees funds remain locked in escrow until verified delivery, eliminating payment disputes.
""")

    # =========================================================================
    # SLIDE 14: WORKFLOW & BLOCKCHAIN EXPLORER
    # =========================================================================
    s14 = prs.slides.add_slide(blank_layout)
    set_slide_background(s14)
    add_header(s14, "Lifecycle & Auditability", "Eco Chain Shipping Workflow & Blockchain Explorer", "End-to-end operational workflow and visual block explorer inspection")

    # Top: Complete project workflow from user prompt:
    # Create Shipment -> Create Transaction -> Validate Transaction -> Generate Merkle Root -> Mine Block -> Add Block to Blockchain -> Validate Blockchain -> Smart Contract -> Blockchain Explorer
    add_card(s14, 0.8, 1.65, 11.7, 1.45, BG_CARD, BORDER_SUBTLE)
    tb_wf = s14.shapes.add_textbox(Inches(1.05), Inches(1.75), Inches(11.2), Inches(1.25))
    tf_wf = tb_wf.text_frame
    tf_wf.word_wrap = True

    p = tf_wf.paragraphs[0]
    r = p.add_run()
    r.text = "ECO CHAIN SHIPPING COMPLETE WORKFLOW"
    r.font.name = "Segoe UI"
    r.font.size = Pt(11)
    r.font.bold = True
    r.font.color.rgb = EMERALD

    wf_steps = [
        "1. Create Shipment",
        "2. Create Transaction",
        "3. Validate Transaction",
        "4. Generate Merkle Root",
        "5. Mine Block",
        "6. Add Block to Chain",
        "7. Validate Blockchain",
        "8. Smart Contract",
        "9. Explorer"
    ]
    for i, st in enumerate(wf_steps):
        sbox = s14.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.05 + i * 1.25), Inches(2.25), Inches(1.15), Inches(0.48))
        sbox.fill.solid()
        sbox.fill.fore_color.rgb = BG_CARD_LIGHT
        sbox.line.color.rgb = EMERALD if i in [0, 4, 8] else CYAN
        tf_s = sbox.text_frame
        tf_s.vertical_anchor = MSO_ANCHOR.MIDDLE
        p_s = tf_s.paragraphs[0]
        p_s.alignment = PP_ALIGN.CENTER
        r_s = p_s.add_run()
        r_s.text = st
        r_s.font.name = "Segoe UI"
        r_s.font.size = Pt(8)
        r_s.font.bold = True
        r_s.font.color.rgb = WHITE

    # Bottom Left: What Blockchain Explorer Displays (User prompt items)
    add_card(s14, 0.8, 3.3, 5.7, 3.8, BG_CARD, BORDER_SUBTLE)
    tb_exp = s14.shapes.add_textbox(Inches(1.05), Inches(3.45), Inches(5.2), Inches(3.5))
    tf_exp = tb_exp.text_frame
    tf_exp.word_wrap = True

    p = tf_exp.paragraphs[0]
    r = p.add_run()
    r.text = "BLOCKCHAIN EXPLORER AUDIT FIELDS"
    r.font.name = "Segoe UI"
    r.font.size = Pt(11.5)
    r.font.bold = True
    r.font.color.rgb = CYAN

    exp_fields = [
        ("Block Number", "Identifies the sequential block index in the ledger"),
        ("Timestamp", "Exact UNIX creation date & time of the block"),
        ("Previous Hash", "Verifies the cryptographic link to preceding block"),
        ("Current Hash", "Current block's 64-character SHA-256 fingerprint"),
        ("Nonce", "Proof of Work computational counter solved"),
        ("Merkle Root", "Tamper-evident summary of all block transactions"),
        ("Transactions", "List of sender, receiver, cargo details, and amounts"),
        ("Mining Status", "Confirms PoW consensus target was satisfied (✔ Valid)")
    ]
    for ef_title, ef_desc in exp_fields:
        p = tf_exp.add_paragraph()
        p.space_before = Pt(2.5)
        r_et = p.add_run()
        r_et.text = f"✔ {ef_title}: "
        r_et.font.name = "Segoe UI"
        r_et.font.size = Pt(9.5)
        r_et.font.bold = True
        r_et.font.color.rgb = WHITE
        r_ed = p.add_run()
        r_ed.text = ef_desc
        r_ed.font.name = "Segoe UI"
        r_ed.font.size = Pt(8.5)
        r_ed.font.color.rgb = SLATE_LIGHT

    # Bottom Right: Explorer UI Mockup / Placeholder for actual screenshot
    add_card(s14, 6.8, 3.3, 5.7, 3.8, BG_CARD_LIGHT, CYAN_BORDER, border_width=1.5)
    tb_mock = s14.shapes.add_textbox(Inches(7.05), Inches(3.45), Inches(5.2), Inches(0.4))
    tf_mock = tb_mock.text_frame
    p = tf_mock.paragraphs[0]
    r = p.add_run()
    r.text = "PROJECT BLOCKCHAIN EXPLORER SCREENSHOT"
    r.font.name = "Segoe UI"
    r.font.size = Pt(11)
    r.font.bold = True
    r.font.color.rgb = CYAN

    exp_inner = s14.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(7.05), Inches(3.9), Inches(5.2), Inches(3.0))
    exp_inner.fill.solid()
    exp_inner.fill.fore_color.rgb = BG_DARK
    exp_inner.line.color.rgb = BORDER_SUBTLE
    tf_in = exp_inner.text_frame
    tf_in.word_wrap = True

    p = tf_in.paragraphs[0]
    r = p.add_run()
    r.text = "🔍 Search by Block Number, Hash, or Transaction ID...\n"
    r.font.name = "Segoe UI"
    r.font.size = Pt(9.5)
    r.font.color.rgb = SLATE_MUTED

    p2 = tf_in.add_paragraph()
    r2 = p2.add_run()
    r2.text = "BLOCK #1  [ CONFIRMED & MINED ✔ ]\n"
    r2.font.name = "Segoe UI"
    r2.font.size = Pt(10)
    r2.font.bold = True
    r2.font.color.rgb = EMERALD

    mock_lines = [
        ("Current Hash:", "008b2c4e1f9a...b9a7c4 (Mined PoW)"),
        ("Previous Hash:", "00a4f8d91c2e...b7e21a (Genesis Hash)"),
        ("Merkle Root:", "4e21a9f0...bc8190"),
        ("Nonce & Difficulty:", "Nonce = 165  |  Difficulty = 2"),
        ("Transactions:", "1 Confirmed (SHP-101 Escrow: 300 ECO)"),
        ("Mining Status:", "✔ Valid Hash Verified by Network")
    ]
    for mlbl, mval in mock_lines:
        p_m = tf_in.add_paragraph()
        r_ml = p_m.add_run()
        r_ml.text = f"{mlbl} "
        r_ml.font.name = "Segoe UI"
        r_ml.font.size = Pt(8.5)
        r_ml.font.bold = True
        r_ml.font.color.rgb = SLATE_MUTED
        r_mv = p_m.add_run()
        r_mv.text = f"{mval}\n"
        r_mv.font.name = "Consolas" if "Hash" in mlbl else "Segoe UI"
        r_mv.font.size = Pt(8.5)
        r_mv.font.color.rgb = WHITE

    p_scr = tf_in.add_paragraph()
    r_scr = p_scr.add_run()
    r_scr.text = "[ Screenshot Placeholder: Insert actual Explorer UI screenshot here ]"
    r_scr.font.name = "Segoe UI"
    r_scr.font.size = Pt(8)
    r_scr.font.italic = True
    r_scr.font.color.rgb = CYAN

    add_notes(s14, """
Slide 14 brings together the full end-to-end workflow of our project.
The process starts with creating a shipment, generating and validating the transaction, computing the Merkle root, mining the block, adding it to the chain, validating the blockchain, and executing smart contract logic.
To inspect all of this in real-time, our Blockchain Explorer displays eight essential parameters:
Block Number, Timestamp, Previous Hash, Current Hash, Nonce, Merkle Root, Transactions, and Mining Status.
This gives faculty examiners and auditors a clear, transparent window into the entire shipping ledger.
""")

    # =========================================================================
    # SLIDE 15: ADVANTAGES, FUTURE SCOPE & CONCLUSION
    # =========================================================================
    s15 = prs.slides.add_slide(blank_layout)
    set_slide_background(s15)
    add_header(s15, "Project Summary", "Advantages, Future Scope & Conclusion", "Key project benefits, production roadmap, and concluding remarks")

    cols15 = [
        ("ADVANTAGES", "Key Project Strengths", [
            ("Transparency", "All stakeholders view the same single version of truth."),
            ("Security", "Decentralized architecture with zero single point of failure."),
            ("Tamper Detection", "Any data alteration breaks cryptographic links immediately."),
            ("Data Integrity", "SHA-256 hashes guarantee uncorrupted historical records."),
            ("Shipment Traceability", "Complete verifiable audit trail from origin to destination."),
            ("Transaction Validation", "Prevents invalid senders, negative amounts, or fraud.")
        ], EMERALD),
        ("FUTURE SCOPE", "Expansion Roadmap", [
            ("Real Blockchain Integration", "Deploy on public/consortium chains like Ethereum or Polygon."),
            ("IoT Shipment Tracking", "Smart sensor integration for container temp & humidity."),
            ("GPS Tracking", "Automated waypoint triggers via live vessel coordinates."),
            ("Real Smart Contracts", "Production Solidity contracts with multi-sig escrow."),
            ("Carbon Emission Tracking", "Verifiable carbon footprint & carbon credit tokenization."),
            ("Supply-Chain Integration", "Customs, port authorities, and banks in unified network.")
        ], CYAN),
        ("CONCLUSION", "Project Evaluation", [
            ("Concept Demonstration", "Proves blockchain solves trust and transparency bottlenecks."),
            ("Shipping Security", "Logistics data is protected against unauthorized manipulation."),
            ("Automation Efficiency", "Smart contract escrow eliminates manual payment disputes."),
            ("Curriculum Success", "Fully implemented all 12 core blockchain principles natively.")
        ], WHITE)
    ]

    for i, (col_title, col_sub, col_items, col_acc) in enumerate(cols15):
        x = 0.8 + i * 3.95
        add_card(s15, x, 1.65, 3.8, 4.4, BG_CARD, BORDER_SUBTLE)

        hbar = s15.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(x), Inches(1.65), Inches(3.8), Inches(0.08))
        hbar.fill.solid()
        hbar.fill.fore_color.rgb = col_acc
        hbar.line.fill.background()

        tb = s15.shapes.add_textbox(Inches(x + 0.2), Inches(1.85), Inches(3.4), Inches(4.0))
        tf = tb.text_frame
        tf.word_wrap = True

        p = tf.paragraphs[0]
        r = p.add_run()
        r.text = col_title
        r.font.name = "Segoe UI"
        r.font.size = Pt(12)
        r.font.bold = True
        r.font.color.rgb = col_acc

        p_sub = tf.add_paragraph()
        r_sub = p_sub.add_run()
        r_sub.text = col_sub
        r_sub.font.name = "Segoe UI"
        r_sub.font.size = Pt(9.5)
        r_sub.font.bold = True
        r_sub.font.color.rgb = WHITE
        p_sub.space_after = Pt(6)

        for it_title, it_desc in col_items:
            p_it = tf.add_paragraph()
            p_it.space_before = Pt(3.5)
            r_it = p_it.add_run()
            r_it.text = f"✔ {it_title}: "
            r_it.font.name = "Segoe UI"
            r_it.font.size = Pt(9.5)
            r_it.font.bold = True
            r_it.font.color.rgb = WHITE
            r_id = p_it.add_run()
            r_id.text = it_desc
            r_id.font.name = "Segoe UI"
            r_id.font.size = Pt(8.5)
            r_id.font.color.rgb = SLATE_LIGHT

    # Bottom Conclusion & THANK YOU Banner
    add_card(s15, 0.8, 6.2, 11.7, 0.85, BG_CARD_LIGHT, EMERALD_BORDER, border_width=1.5)
    tb_ty = s15.shapes.add_textbox(Inches(1.05), Inches(6.25), Inches(11.2), Inches(0.75))
    tf_ty = tb_ty.text_frame
    tf_ty.word_wrap = True
    p = tf_ty.paragraphs[0]
    r_t1 = p.add_run()
    r_t1.text = "CONCLUSION & THANK YOU!\n"
    r_t1.font.name = "Segoe UI"
    r_t1.font.size = Pt(12)
    r_t1.font.bold = True
    r_t1.font.color.rgb = EMERALD
    r_t2 = p.add_run()
    r_t2.text = "Eco Chain Shipping demonstrates how blockchain concepts can be applied to shipping management to improve transparency, security, and data integrity. Thank you for your evaluation."
    r_t2.font.name = "Segoe UI"
    r_t2.font.size = Pt(10.5)
    r_t2.font.color.rgb = WHITE

    add_notes(s15, """
To conclude our project presentation:
Eco Chain Shipping clearly demonstrates the significant advantages of blockchain in logistics, notably transparency, security, tamper detection, data integrity, shipment traceability, and transaction validation.
In the future, the system can expand into real blockchain networks, IoT sensor tracking, GPS automated waypoints, and carbon credit accounting.
In conclusion, Eco Chain Shipping demonstrates how blockchain concepts can be applied to shipping management to improve transparency, security, and data integrity.
Thank you, respected faculty and examiners.
""")

    # =========================================================================
    # SLIDE 16: POSSIBLE REVIEW QUESTIONS (Q1 - Q5)
    # =========================================================================
    s16 = prs.slides.add_slide(blank_layout)
    set_slide_background(s16)
    add_header(s16, "Faculty Review & Viva Preparation", "Possible Review Questions: Fundamentals (Q1 – Q5)", "Short, simple, and project-specific answers for college review defense")

    q_cards_1 = [
        ("1. What is blockchain?", "Blockchain is a distributed, tamper-resistant digital ledger where data is stored in blocks connected using cryptographic hashes, eliminating single points of failure."),
        ("2. Why did you choose blockchain for shipping?", "Shipping involves multiple independent parties (shippers, carriers, customs) who lack mutual trust. Blockchain prevents data manipulation, tracks shipment history, and automates escrow payments."),
        ("3. What is a hash?", "A hash is a mathematical function that converts any input into a fixed-length hexadecimal string. It is strictly one-way, deterministic, and impossible to reverse."),
        ("4. Why did you use SHA-256?", "SHA-256 produces a secure 64-character (256-bit) digest. It has strong collision resistance and an avalanche effect where changing one character flips over 50% of the output."),
        ("5. What is a block?", "A block is a digital container in the chain. In our project, it contains six fields: Index, Timestamp, Data (shipments/transactions), Previous Hash, Hash, and Nonce.")
    ]

    for i, (q_title, q_ans) in enumerate(q_cards_1):
        y = 1.65 + i * 1.05
        add_card(s16, 0.8, y, 11.7, 0.95, BG_CARD, BORDER_SUBTLE)
        tb_q = s16.shapes.add_textbox(Inches(1.05), Inches(y + 0.1), Inches(11.2), Inches(0.75))
        tf_q = tb_q.text_frame
        tf_q.word_wrap = True

        p = tf_q.paragraphs[0]
        r_qt = p.add_run()
        r_qt.text = f"{q_title}\n"
        r_qt.font.name = "Segoe UI"
        r_qt.font.size = Pt(10.5)
        r_qt.font.bold = True
        r_qt.font.color.rgb = CYAN

        r_qa = p.add_run()
        r_qa.text = q_ans
        r_qa.font.name = "Segoe UI"
        r_qa.font.size = Pt(9.5)
        r_qa.font.color.rgb = WHITE

    add_notes(s16, """
Examiners often begin by testing core concepts.
If asked 'What is blockchain?', provide the crisp definition: a distributed, tamper-resistant digital ledger connected using hashes.
For 'Why shipping?', explain that shipping involves multiple independent parties who need an immutable shared record.
When asked about hash and SHA-256, emphasize that SHA-256 is deterministic, irreversible, and produces 64 hex characters.
And when asked 'What is a block?', name the six fields: Index, Timestamp, Data, Previous Hash, Hash, and Nonce.
""")

    # =========================================================================
    # SLIDE 17: POSSIBLE REVIEW QUESTIONS (Q6 - Q10)
    # =========================================================================
    s17 = prs.slides.add_slide(blank_layout)
    set_slide_background(s17)
    add_header(s17, "Faculty Review & Viva Preparation", "Possible Review Questions: Mining & Transactions (Q6 – Q10)", "Short, simple, and project-specific answers for college review defense")

    q_cards_2 = [
        ("6. What is a Genesis Block?", "The Genesis Block is the very first block in a blockchain (index 0). It has no previous block, so its previousHash is hardcoded to '0'."),
        ("7. What is Proof of Work?", "Proof of Work is a consensus mechanism requiring miners to solve a computational puzzle—finding a hash that satisfies difficulty requirements (leading zeros)—before adding a block."),
        ("8. What is mining?", "Mining is the process of repeatedly calculating SHA-256 hashes with different nonce values until a valid hash meeting the difficulty target is found."),
        ("9. What is a nonce?", "'Nonce' stands for 'number used once'. It is an integer counter that the miner increments from 0 on every trial until a hash meeting the difficulty target is generated."),
        ("10. What is a wallet?", "A wallet represents a participant's account holding an address and balance. In our project, wallets hold simulated EcoCoins and demo keys for educational safety.")
    ]

    for i, (q_title, q_ans) in enumerate(q_cards_2):
        y = 1.65 + i * 1.05
        add_card(s17, 0.8, y, 11.7, 0.95, BG_CARD, BORDER_SUBTLE)
        tb_q = s17.shapes.add_textbox(Inches(1.05), Inches(y + 0.1), Inches(11.2), Inches(0.75))
        tf_q = tb_q.text_frame
        tf_q.word_wrap = True

        p = tf_q.paragraphs[0]
        r_qt = p.add_run()
        r_qt.text = f"{q_title}\n"
        r_qt.font.name = "Segoe UI"
        r_qt.font.size = Pt(10.5)
        r_qt.font.bold = True
        r_qt.font.color.rgb = EMERALD

        r_qa = p.add_run()
        r_qa.text = q_ans
        r_qa.font.name = "Segoe UI"
        r_qa.font.size = Pt(9.5)
        r_qa.font.color.rgb = WHITE

    add_notes(s17, """
These five questions focus on consensus, mining, and accounts.
State clearly that the Genesis Block is Block 0 with previousHash '0'.
For Proof of Work and mining, explain that mining is finding a hash that starts with required leading zeros, and the nonce is the counter that is incremented on every attempt.
When asked about wallets, highlight that our wallets use simulated addresses and EcoCoins specifically for educational safety.
""")

    # =========================================================================
    # SLIDE 18: POSSIBLE REVIEW QUESTIONS (Q11 - Q15)
    # =========================================================================
    s18 = prs.slides.add_slide(blank_layout)
    set_slide_background(s18)
    add_header(s18, "Faculty Review & Viva Preparation", "Possible Review Questions: Advanced Architecture (Q11 – Q15)", "Short, simple, and project-specific answers for college review defense")

    q_cards_3 = [
        ("11. What is a transaction?", "A transaction represents a transfer of value or shipping event between two wallets, containing sender address, receiver address, amount, and timestamp."),
        ("12. What is transaction validation?", "Transaction validation checks that a transaction meets 4 rules before entry into a block: sender exists, receiver exists, amount > 0, and sender has sufficient balance."),
        ("13. What is a Merkle Tree?", "A Merkle Tree is a binary tree where pairs of transaction hashes are combined until reaching a single Merkle Root, summarizing all transactions inside a block."),
        ("14. What is a smart contract?", "A smart contract is self-executing code with defined rules. In our project, it simulates shipping stages (Pending ➔ Delivered) and automatically releases escrow funds upon delivery."),
        ("15. How does your project detect tampering?", "Our validateBlockchain() function recalculates every block's hash and verifies previousHash links. If data changes, the hash changes, breaking the connection and flagging the chain as invalid.")
    ]

    for i, (q_title, q_ans) in enumerate(q_cards_3):
        y = 1.65 + i * 1.05
        add_card(s18, 0.8, y, 11.7, 0.95, BG_CARD, BORDER_SUBTLE)
        tb_q = s18.shapes.add_textbox(Inches(1.05), Inches(y + 0.1), Inches(11.2), Inches(0.75))
        tf_q = tb_q.text_frame
        tf_q.word_wrap = True

        p = tf_q.paragraphs[0]
        r_qt = p.add_run()
        r_qt.text = f"{q_title}\n"
        r_qt.font.name = "Segoe UI"
        r_qt.font.size = Pt(10.5)
        r_qt.font.bold = True
        r_qt.font.color.rgb = AMBER

        r_qa = p.add_run()
        r_qa.text = q_ans
        r_qa.font.name = "Segoe UI"
        r_qa.font.size = Pt(9.5)
        r_qa.font.color.rgb = WHITE

    add_notes(s18, """
Questions 11 through 15 cover transactions, Merkle trees, smart contracts, and tampering.
Explain that transactions record transfers between wallets, and validation verifies existence, positive amount, and sufficient balance.
For Merkle Trees, explain that they combine transaction hashes in pairs up to the Merkle Root.
For smart contracts, explain our logistics state machine that automatically releases escrow payments.
And for tamper detection, explain that modifying block data alters the recalculated hash and breaks the previousHash link, immediately alerting the validator.
""")

    # =========================================================================
    # SLIDE 19: THANK YOU & LIVE DEMO LAUNCH
    # =========================================================================
    s19 = prs.slides.add_slide(blank_layout)
    set_slide_background(s19)
    add_header(s19, "Demonstration & Viva", "Thank You — Ready for Live Demonstration", "Interactive review walk-through and examiner questions")

    add_card(s19, 0.8, 1.65, 11.7, 5.45, BG_CARD, EMERALD_BORDER, border_width=1.5)
    tb_c = s19.shapes.add_textbox(Inches(1.2), Inches(1.8), Inches(10.9), Inches(5.0))
    tf_c = tb_c.text_frame
    tf_c.word_wrap = True

    p = tf_c.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    r = p.add_run()
    r.text = "ECO CHAIN SHIPPING"
    r.font.name = "Segoe UI"
    r.font.size = Pt(28)
    r.font.bold = True
    r.font.color.rgb = WHITE

    p_sub = tf_c.add_paragraph()
    p_sub.alignment = PP_ALIGN.CENTER
    r_sub = p_sub.add_run()
    r_sub.text = "Interactive Project Demonstration Walk-Through"
    r_sub.font.name = "Segoe UI"
    r_sub.font.size = Pt(14)
    r_sub.font.bold = True
    r_sub.font.color.rgb = CYAN
    p_sub.space_after = Pt(14)

    demo_steps = [
        ("Step 1: SHA-256 Sandbox", "Type text & observe avalanche character changes live"),
        ("Step 2: Create Shipment", "Input cargo manifest, eco score, and lock freight escrow"),
        ("Step 3: PoW Mining Lab", "Adjust difficulty, click 'Mine Block', watch nonce iterations"),
        ("Step 4: Tamper Lab & Repair", "Alter block data, watch chain fail, run self-healing re-mine"),
        ("Step 5: Chain Explorer", "Deep inspect blocks, transactions, Merkle roots, and JSON logs")
    ]
    for i, (ds_t, ds_d) in enumerate(demo_steps):
        y = 3.2 + i * 0.72
        dbox = s19.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.5), Inches(y), Inches(10.3), Inches(0.6))
        dbox.fill.solid()
        dbox.fill.fore_color.rgb = BG_CARD_LIGHT
        dbox.line.color.rgb = BORDER_SUBTLE
        tf_db = dbox.text_frame
        tf_db.vertical_anchor = MSO_ANCHOR.MIDDLE
        p_db = tf_db.paragraphs[0]
        r_dt = p_db.add_run()
        r_dt.text = f"✔ {ds_t}:  "
        r_dt.font.name = "Segoe UI"
        r_dt.font.size = Pt(10.5)
        r_dt.font.bold = True
        r_dt.font.color.rgb = EMERALD if i == 0 else (CYAN if i in [1, 2] else AMBER)
        r_dd = p_db.add_run()
        r_dd.text = ds_d
        r_dd.font.name = "Segoe UI"
        r_dd.font.size = Pt(10)
        r_dd.font.color.rgb = WHITE

    add_notes(s19, """
This concludes our formal slide presentation.
We have our live web application running and ready on port 5000.
We invite the review panel to select any module: we can demonstrate live SHA-256 avalanche effect, book a shipment with escrow lock, mine a block with adjustable difficulty, or intentionally tamper with historical data in our Tamper Lab to show the validation engine in action.
Thank you once again for your mentorship and time.
""")

    output_path = os.path.join(os.getcwd(), "Eco_Chain_Shipping_Presentation.pptx")
    prs.save(output_path)
    print(f"Presentation successfully created at: {output_path}")
    print(f"Total Slides Created: {len(prs.slides)}")

if __name__ == "__main__":
    build_perfect_presentation()
