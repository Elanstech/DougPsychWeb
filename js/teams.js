/**
 * teams.js — renders the team grid + drives the profile modal.
 * Single source of truth: edit a person by editing their TEAM entry.
 * Global behaviors (header, nav, reveal, counters) come from script.js.
 * Wrapped in an IIFE so nothing collides with script.js globals.
 */
(function () {
    'use strict';

    /* ------------------------------------------------------------------
       TEAM DATA — order: Doug, existing Doug Uhlig team, then Holistic.
       Fields:
         name, role, img, specialty, blurb (card text),
         sections: [{ title, icon, paragraphs:[], tags:[] }]
    ------------------------------------------------------------------ */
    var TEAM = [
        {
            name: "Dr. Doug Uhlig",
            role: "PhD, Clinical Psychologist & Founder",
            img: "doug.jpeg",
            specialty: "Leadership & Clinical Excellence",
            blurb: "Over two decades of clinical excellence, blending CBT, meditation, and mindfulness with deep, compassionate care.",
            sections: [
                { title: "About", icon: "fa-heart-pulse", paragraphs: [
                    "Within each of us is a deeper or higher self we can contact. Through meditation, cognitive behavioral therapy, hypnosis, and Gestalt therapy, Dr. Uhlig helps people reach this part of themselves — always available in times of need.",
                    "As founder of the practice, he combines traditional psychodynamic and cognitive behavioral therapy with decades of teaching meditation and mindfulness, working with adults across marriage counseling, identity, parenting, and personal growth."
                ]},
                { title: "Areas of Expertise", icon: "fa-tools", tags: [
                    "Cognitive Behavioral Therapy", "Meditation & Mindfulness", "Marriage Counseling",
                    "Executive & Leadership Coaching", "Hypnotherapy", "Clinical Supervision"
                ]},
                { title: "Education & Credentials", icon: "fa-graduation-cap", tags: [
                    "PhD, Clinical Psychology", "Licensed Clinical Psychologist (NYS)",
                    "20+ Years of Clinical Experience", "Certified Meditation Teacher"
                ]}
            ]
        },
        {
            name: "Angela Christina Ferri",
            role: "Licensed Mental Health Counselor",
            img: "Angela.jpeg",
            specialty: "Youth & Young Adult Therapy",
            blurb: "Specializing in youth and young adult therapy, anger management, self-esteem, and academic performance anxiety.",
            sections: [
                { title: "About", icon: "fa-heart-pulse", paragraphs: [
                    "As a licensed mental health counselor, I specialize in supporting young adults grappling with anger, low self-esteem, and the anxiety tied to school performance. My goal is to empower people to care for themselves and become the best version of themselves.",
                    "I also work with clients experiencing depression, especially those struggling to engage in daily life. My approach is compassionate and client-centered, creating a safe space to explore challenges and work toward meaningful change."
                ]},
                { title: "Areas of Expertise", icon: "fa-tools", tags: [
                    "Young Adult Mental Health", "Anger Management", "Academic Performance Anxiety",
                    "Self-Esteem Building", "Depression", "LGBTQ+ Affirmative Therapy"
                ]},
                { title: "Therapeutic Approaches", icon: "fa-graduation-cap", tags: [
                    "CBT", "Motivational Interviewing", "Mindfulness Techniques", "Strength-Based Interventions"
                ]}
            ]
        },
        {
            name: "Jaqueline Galynsky",
            role: "Licensed Mental Health Counselor",
            img: "jaq.jpeg",
            specialty: "Bilingual Therapy (English/Russian)",
            blurb: "Bilingual therapy with expertise in CBT, REBT, and mindfulness-based interventions.",
            sections: [
                { title: "About", icon: "fa-heart-pulse", paragraphs: [
                    "The therapeutic experience starts with you. Whether you're overwhelmed by daily stress, anxiety, or depression, I work collaboratively to create a safe, open therapeutic relationship.",
                    "I believe a non-judgmental, empathic, welcoming space promotes a healthier, happier life. Using CBT, REBT, and mindfulness, my goal is to help you address what's happening within."
                ]},
                { title: "Areas of Expertise", icon: "fa-tools", tags: [
                    "Bilingual Therapy (English/Russian)", "Anxiety & Depression", "Stress Management",
                    "Cultural Sensitivity", "Life Transitions"
                ]},
                { title: "Therapeutic Approaches", icon: "fa-graduation-cap", tags: [
                    "CBT", "REBT", "Mindfulness-Based Techniques", "Solution-Focused Brief Therapy"
                ]}
            ]
        },
        {
            name: "Zbigniew Korczak",
            role: "Licensed Clinical Social Worker",
            img: "Zbigniew.jpeg",
            specialty: "Trauma & Addiction Treatment",
            blurb: "Specialized in trauma, PTSD, and addiction using Buddhist compassion therapy and CBT.",
            sections: [
                { title: "About", icon: "fa-heart-pulse", paragraphs: [
                    "Life is tough, and we all need help. My practice is based on Buddhist compassion and cognitive behavioral therapy.",
                    "I work with alcohol and drug addiction as well as trauma and PTSD, offering both a traditional psychological perspective and a discovery of your inner meaning, strengths, dreams, creativity, and spirituality."
                ]},
                { title: "Areas of Expertise", icon: "fa-tools", tags: [
                    "Trauma & PTSD", "Addiction Recovery", "Buddhist Compassion Therapy",
                    "CBT", "Anxiety & Depression", "Mindfulness-Based Interventions"
                ]},
                { title: "Education & Credentials", icon: "fa-graduation-cap", tags: [
                    "LCSW-R", "CASAC", "Certified Clinical Trauma Professional (CCTP)", "Buddhist Psychology Training"
                ]}
            ]
        },
        {
            name: "Stephanie Palacios",
            role: "Mental Health Counselor",
            img: "Stephanie.jpeg",
            specialty: "Bilingual Therapy (English/Spanish)",
            blurb: "Bilingual counseling focused on stress reduction, self-esteem, and trauma recovery.",
            sections: [
                { title: "About", icon: "fa-heart-pulse", paragraphs: [
                    "Hi! I'm a Spanish-speaking mental health counselor. I offer individual counseling, stress reduction, self-esteem support, anger management, child behavioral concerns, and anxiety and depression treatment. I understand your cultural needs and welcome you.",
                    "My highest priority is to meet you where you are — making sure you're heard, understood, accepted, and empowered. I've helped clients heal from childhood trauma using CBT to address thought patterns and emotional wellbeing."
                ]},
                { title: "Areas of Expertise", icon: "fa-tools", tags: [
                    "Bilingual Counseling (English/Spanish)", "Stress Reduction", "Self-Esteem",
                    "Anger Management", "Child Behavioral Concerns", "Anxiety & Depression", "Childhood Trauma"
                ]},
                { title: "Therapeutic Approaches", icon: "fa-graduation-cap", tags: [
                    "CBT", "Culturally Responsive Therapy", "Trauma-Informed Care", "Strength-Based Counseling"
                ]}
            ]
        },
        {
            name: "Rashanda Allen",
            role: "Clinical Psychologist",
            img: "RASHANDA.jpeg",
            specialty: "Cognitive Behavioral Therapy",
            blurb: "CBT, DBT, and mindfulness training with 20+ years serving clients across all ages.",
            sections: [
                { title: "About", icon: "fa-heart-pulse", paragraphs: [
                    "Dr. Allen received her PhD from Walden University with Honors. A NYS clinical psychologist, she specializes in therapy for adults, children, and families, with 20+ years providing CBT, DBT, mindfulness training, motivational interviewing, and supportive psychotherapy.",
                    "She provides culturally sensitive approaches for individuals who may feel lost or hopeless, as well as trauma- and stress-related disorders, offering a safe space to explore and express emotions freely."
                ]},
                { title: "Areas of Expertise", icon: "fa-tools", tags: [
                    "Psychological Testing & Assessment", "Anxiety & Depression", "PTSD",
                    "Mood Disorders & OCD", "Conduct Disorders", "Family & Child Psychology"
                ]},
                { title: "Education & Credentials", icon: "fa-graduation-cap", tags: [
                    "PhD, Clinical Psychology (Walden, Honors)", "NYS Licensed Clinical Psychologist",
                    "20+ Years Experience", "Certified in DBT & CBT"
                ]}
            ]
        },
        {
            name: "Yunetta Baron",
            role: "Licensed Master Social Worker",
            img: "https://photos.psychologytoday.com/09a338db-34ae-4d24-9455-d5ab1ee3f461/4/320x400.jpeg",
            specialty: "Bilingual Therapy (English/Russian)",
            blurb: "Bilingual therapy with expertise in trauma, addiction, family counseling, and elder care.",
            sections: [
                { title: "About", icon: "fa-heart-pulse", paragraphs: [
                    "I'm a Russian-speaking licensed social worker with over 20 years of experience across all age groups. If you're seeking help to recover from trauma, abuse, addiction, anger, depression, or anxiety, please don't hesitate to reach out.",
                    "I provide individual psychotherapy and counseling for couples, the elderly, and families, using CBT, mindfulness meditation, and insight-oriented therapy."
                ]},
                { title: "Areas of Expertise", icon: "fa-tools", tags: [
                    "Trauma & Abuse Recovery", "Addiction Treatment", "Anger Management",
                    "Depression & Anxiety", "Couples & Family Counseling", "Elder Care Psychology"
                ]},
                { title: "Education & Credentials", icon: "fa-graduation-cap", tags: [
                    "LMSW", "20+ Years Experience", "Trauma Recovery Training", "Certified in Mindfulness Meditation"
                ]}
            ]
        },
        {
            name: "Jenny Toussaint",
            role: "Mental Health Counselor",
            img: "Jenny.jpeg",
            specialty: "Anxiety & Depression",
            blurb: "Anxiety and depression treatment with a focus on life transitions and healthy coping.",
            sections: [
                { title: "About", icon: "fa-heart-pulse", paragraphs: [
                    "It's normal to experience a range of emotions when beginning therapy. With the right tools and support, life can be easier to navigate — and I'm glad you've taken the first step.",
                    "My purpose is to inspire clients to become a better version of themselves in a welcoming, safe, and caring atmosphere — helping them gain insight, improve self-awareness, and build healthy coping mechanisms."
                ]},
                { title: "Areas of Expertise", icon: "fa-tools", tags: [
                    "Anxiety & Depression", "Life Transitions", "Self-Awareness", "Healthy Coping",
                    "Personal Growth", "Stress Management", "Emotional Regulation"
                ]},
                { title: "Therapeutic Approaches", icon: "fa-graduation-cap", tags: [
                    "CBT", "Insight-Oriented Therapy", "Solution-Focused Brief Therapy", "Supportive Therapy"
                ]}
            ]
        },
        {
            name: "Saima Gul",
            role: "Licensed Mental Health Counselor",
            img: "https://photos.psychologytoday.com/8815a428-6d2a-49f3-b53f-ea298e32e267/1/320x400.jpeg",
            specialty: "Integrative Therapy & Trauma Recovery",
            blurb: "Personalized, integrative therapy for anxiety, depression, trauma, PTSD, and relationships.",
            sections: [
                { title: "About", icon: "fa-heart-pulse", paragraphs: [
                    "I help individuals and couples navigate anxiety, depression, trauma, PTSD, grief, low self-esteem, burnout, life transitions, and relationship challenges. If you feel overwhelmed or stuck in old patterns, we'll work together to build coping skills and foster lasting change.",
                    "My approach is personalized and integrative, drawing from coaching, CBT, CPT, family systems, MBCT, motivational interviewing, multicultural therapy, positive psychology, and prolonged exposure therapy — tailored to your goals and pace."
                ]},
                { title: "Areas of Expertise", icon: "fa-tools", tags: [
                    "Anxiety & Depression", "Trauma & PTSD", "Grief & Loss", "Self-Esteem",
                    "Burnout Recovery", "Life Transitions", "Couples Therapy"
                ]},
                { title: "Therapeutic Approaches", icon: "fa-graduation-cap", tags: [
                    "CBT", "CPT", "MBCT", "Prolonged Exposure", "Family Systems", "Positive Psychology"
                ]},
                { title: "Special Offering", icon: "fa-gift", paragraphs: [
                    "Free initial consultation — a complimentary first session to explore your needs and see if we're the right fit, with no obligation to continue."
                ]}
            ]
        },
        {
            name: "Emma Johnson",
            role: "Clinical Social Worker / Therapist",
            img: "https://photos.psychologytoday.com/1843cea7-bc19-4849-ad0b-b0bdd00489ab/1/320x400.jpeg",
            specialty: "Relationship & Family Therapy",
            blurb: "Relationship and family therapy focused on communication, conflict resolution, and parenting.",
            sections: [
                { title: "About", icon: "fa-heart-pulse", paragraphs: [
                    "I focus on creating a warm, supportive environment where clients can safely explore challenges and work toward growth, combining evidence-based practices with compassionate understanding for individuals, couples, and families.",
                    "I believe in the inherent strength and resilience of every person, helping you harness your own inner resources while developing new skills and perspectives."
                ]},
                { title: "Areas of Expertise", icon: "fa-tools", tags: [
                    "Couples Counseling", "Family Therapy", "Communication Skills", "Conflict Resolution",
                    "Parenting Support", "Attachment Issues", "Life Transitions"
                ]},
                { title: "Education & Credentials", icon: "fa-graduation-cap", tags: [
                    "LMSW", "MSW, Columbia University", "Certified in Family Systems Therapy", "Gottman Method Training"
                ]}
            ]
        },
        {
            name: "Rebecca Ostrow",
            role: "Clinical Social Worker / Therapist",
            img: "https://photos.psychologytoday.com/8a54f7ba-db13-483c-b3a4-4c0e7e50f4f3/1/320x400.jpeg",
            specialty: "Mindfulness & Trauma Recovery",
            blurb: "Mindfulness and trauma recovery with expertise in EMDR and trauma-focused CBT.",
            sections: [
                { title: "About", icon: "fa-heart-pulse", paragraphs: [
                    "I integrate trauma-informed care with mindfulness to help clients process difficult experiences and develop healthier relationships with themselves and others, specializing in trauma, anxiety, depression, and life transitions.",
                    "Therapy is a collaborative journey. Combining evidence-based techniques with mindfulness, we work together to increase self-awareness, develop coping strategies, and create meaningful change."
                ]},
                { title: "Areas of Expertise", icon: "fa-tools", tags: [
                    "Trauma & PTSD", "EMDR", "Mindfulness-Based Therapy", "Anxiety & Depression",
                    "Stress Management", "Life Transitions", "Holistic Healing"
                ]},
                { title: "Education & Credentials", icon: "fa-graduation-cap", tags: [
                    "LMSW", "MSW, New York University", "Trauma-Focused CBT", "EMDR Trained", "MBSR Certification"
                ]}
            ]
        },
        {
            name: "Melanie Chandan",
            role: "Mental Health Counselor",
            img: "Melanie.jpeg",
            specialty: "Mental Health Counseling",
            blurb: "Dedicated to compassionate, client-centered care and a warm therapeutic environment.",
            sections: [
                { title: "About", icon: "fa-heart-pulse", paragraphs: [
                    "Melanie Chandan is a dedicated mental health professional committed to compassionate, client-centered care. She creates a warm, supportive environment where clients can explore challenges and work toward meaningful personal growth."
                ]},
                { title: "Credentials", icon: "fa-graduation-cap", tags: [ "Mental Health Counselor" ]}
            ]
        },
        {
            name: "Victoria Liu",
            role: "Mental Health Counselor",
            img: "https://photos.psychologytoday.com/2094b86b-259d-4147-970d-684c73e3ed71/1/320x400.png",
            specialty: "Trauma-Informed Therapy & Resilience",
            blurb: "EMDR-trained, trauma-informed therapy grounded in CBT, DBT, and person-centered care.",
            sections: [
                { title: "About", icon: "fa-heart-pulse", paragraphs: [
                    "Do you often feel overwhelmed, emotionally exhausted, or stuck in patterns that are hard to change? Therapy can be a space to slow down, understand what's happening beneath the surface, and reconnect with yourself more compassionately.",
                    "I'm EMDR trained and provide trauma-informed therapy grounded in CBT, DBT, and person-centered interventions — helping clients build emotional regulation and resilience at a pace that feels safe."
                ]},
                { title: "Areas of Expertise", icon: "fa-tools", tags: [
                    "Anxiety", "Depression", "Trauma & PTSD", "Coping Skills", "Life Transitions",
                    "Relationship Issues", "Self-Esteem", "Stress"
                ]},
                { title: "Therapeutic Approaches", icon: "fa-graduation-cap", tags: [
                    "EMDR", "CBT", "DBT", "Person-Centered Therapy", "Trauma-Informed Care"
                ]}
            ]
        },
        {
            name: "Bolu Chen",
            role: "Mental Health Counselor",
            img: "https://photos.psychologytoday.com/211366a1-0a04-4845-be13-4d88e4ec004b/1/320x400.jpeg",
            specialty: "Identity, Anxiety & Depression",
            blurb: "Integrative, collaborative therapy with deep cultural humility; LGBTQ+ & BIPOC affirming.",
            sections: [
                { title: "About", icon: "fa-heart-pulse", paragraphs: [
                    "Therapy can be a space to slow down and reconnect with yourself — especially the parts that may have been silenced or pushed aside. I offer a supportive, nonjudgmental space to explore your experiences, emotions, and inner world.",
                    "I work with people navigating anxiety, depression, identity exploration, relationships, and life transitions, and especially value supporting LGBTQ+, BIPOC, immigrant, and international student communities. My approach is integrative and collaborative, centering cultural humility and respect."
                ]},
                { title: "Areas of Expertise", icon: "fa-tools", tags: [
                    "Anxiety", "Depression", "LGBTQ+", "Identity & Racial Identity", "Life Transitions",
                    "Relationship Issues", "Self-Esteem", "Trauma & PTSD"
                ]},
                { title: "Therapeutic Approaches", icon: "fa-graduation-cap", tags: [
                    "Integrative & Collaborative", "Culturally Affirming", "Person-Centered", "LGBTQ+ & BIPOC Affirming"
                ]}
            ]
        },
        {
            name: "Marilyn Samaniego",
            role: "Pre-Licensed Professional, MHC, MS",
            img: "https://photos.psychologytoday.com/46087619-7836-4c27-a974-c8031716cb11/2/320x400.jpeg",
            specialty: "Bilingual Counseling (English/Spanish)",
            blurb: "Bilingual services for children, teens, and adults — trauma, stress, and emotional wellbeing.",
            sections: [
                { title: "About", icon: "fa-heart-pulse", paragraphs: [
                    "Having worked in both school settings and private practice, I bring diverse skills and insights to my work. As a fluent Spanish speaker, I'm proud to support the Latinx community with bilingual services.",
                    "My ideal client seeks motivation and resilience in overcoming life's challenges. I provide a safe, supportive environment for children, teens, and adults healing from trauma, managing stress, and discovering their inner strength."
                ]},
                { title: "Areas of Expertise", icon: "fa-tools", tags: [
                    "Depression", "Anxiety", "Self-Esteem", "ADHD", "Trauma & PTSD", "Grief",
                    "Life Transitions", "Parenting", "Women's Issues"
                ]},
                { title: "Education & Credentials", icon: "fa-graduation-cap", tags: [
                    "Pre-Licensed Professional, MHC", "Bilingual (English/Spanish)", "School & Private Practice Experience"
                ]}
            ]
        },
        {
            name: "Maria Quinche",
            role: "Mental Health Counselor",
            img: "https://photos.psychologytoday.com/0eddb89c-cf1c-405e-84dd-b628ba48b1c1/1/320x400.jpeg",
            specialty: "Bilingual Clinician",
            blurb: "Compassionate, bilingual support for anxiety, depression, life transitions, and relationships.",
            sections: [
                { title: "About", icon: "fa-heart-pulse", paragraphs: [
                    "As a bilingual clinician, I work with children and adults, providing a compassionate, nonjudgmental space to explore your thoughts and emotions at your own pace. It takes courage to seek support, and my goal is to meet you where you are.",
                    "I believe healing begins in a space where you feel truly heard and accepted. Whether you're facing anxiety, depression, life transitions, or relationship challenges, I'm here to help."
                ]},
                { title: "Areas of Expertise", icon: "fa-tools", tags: [
                    "Anxiety", "Depression", "Self-Esteem", "Life Transitions", "Relationships", "Children & Adults"
                ]},
                { title: "Credentials", icon: "fa-graduation-cap", tags: [
                    "Bilingual Clinician", "Client-Centered Approach"
                ]}
            ]
        },
        {
            name: "Oxana Turgiss",
            role: "Clinical Social Worker, LMSW",
            img: "https://photos.psychologytoday.com/ab970a2b-15f3-465a-b17b-4838575ea550/2/320x400.jpeg",
            specialty: "Trauma-Informed Care & PTSD",
            blurb: "NYU-trained social worker specializing in trauma-informed care, PTSD, and psychodynamic therapy.",
            sections: [
                { title: "About", icon: "fa-heart-pulse", paragraphs: [
                    "Hello and welcome! I treat children, adolescents, adults, and couples, and enjoy working with people from broad backgrounds. With adults, I first want to understand your story, core beliefs, and past experiences.",
                    "I use psychodynamic therapy, attachment theory, narrative therapy, cognitive processing therapy, and expressive arts, and help build mindfulness and coping skills. I'm highly trained in trauma-informed care and treating PTSD, focusing on post-traumatic growth."
                ]},
                { title: "Areas of Expertise", icon: "fa-tools", tags: [
                    "Trauma & PTSD", "Anxiety", "Bipolar Disorder", "Borderline Personality (BPD)",
                    "Grief", "Domestic Abuse", "Child Therapy", "Women's Issues"
                ]},
                { title: "Education & Credentials", icon: "fa-graduation-cap", tags: [
                    "LMSW", "MSW, New York University", "Trauma-Informed Care", "Psychodynamic Therapy",
                    "Cognitive Processing Therapy", "Expressive Arts Therapy"
                ]}
            ]
        },
        {
            name: "Tyra Brooks",
            role: "Marriage & Family Therapist Associate",
            img: "https://photos.psychologytoday.com/aa3f8182-c835-49d9-bd40-ad362c5b028b/1/320x400.jpeg",
            specialty: "Marriage & Family Therapy",
            blurb: "Relational and systemic approaches for individuals, couples, and families.",
            sections: [
                { title: "About", icon: "fa-heart-pulse", paragraphs: [
                    "As an MFT, in addition to CBT I use relational and systemic approaches in every session, understanding that individual behavior and mental health are heavily influenced by relationships and family environments.",
                    "Using psychotherapy and family systems, I help individuals, couples, and families work through marital conflict, parenting struggles, and personal mental health concerns — paving the way for sustained improvement."
                ]},
                { title: "Areas of Expertise", icon: "fa-tools", tags: [
                    "Marriage & Couples Therapy", "Family Systems", "Parenting Support",
                    "Communication Enhancement", "Relationship Dynamics", "Coping Strategies"
                ]},
                { title: "Therapeutic Approaches", icon: "fa-graduation-cap", tags: [
                    "CBT", "Relational & Systemic Approaches", "Family Systems Therapy", "Client-Centered Care"
                ]}
            ]
        },
        {
            name: "Yaasmeen Rhiman",
            role: "Mental Health Counselor",
            img: "https://photos.psychologytoday.com/35a34fe7-4099-4ca5-be69-0b78c9044aec/1/320x400.png",
            specialty: "Anxiety, Depression & PTSD",
            blurb: "Support for anxiety, depression, PTSD, and BPD with a focus on resilience and stress management.",
            sections: [
                { title: "About", icon: "fa-heart-pulse", paragraphs: [
                    "Hi there! I'm a dedicated mental health counselor working with clients of all ages, offering support for anxiety, depression, PTSD, and borderline personality disorder. My approach emphasizes understanding your unique experiences and challenges.",
                    "Together, we'll develop effective strategies to manage stress, build resilience, and enhance your overall wellbeing. I commend you for taking this important step toward healing."
                ]},
                { title: "Areas of Expertise", icon: "fa-tools", tags: [
                    "Anxiety", "Depression", "PTSD", "Borderline Personality Disorder",
                    "Stress Management", "Resilience Building", "All Age Groups"
                ]},
                { title: "Credentials", icon: "fa-graduation-cap", tags: [
                    "Mental Health Counselor", "Evidence-Based Practices"
                ]}
            ]
        },
        {
            name: "Andrea Basilicato",
            role: "Pre-Licensed Professional, MHC-LP",
            img: "https://photos.psychologytoday.com/1e9373e3-5eed-4252-b583-411b825d9dc5/3/320x400.jpeg",
            specialty: "Person-Centered Therapy & Student Athletes",
            blurb: "Person-centered therapy for anxiety, depression, trauma, and life transitions; supports collegiate athletes.",
            sections: [
                { title: "About", icon: "fa-heart-pulse", paragraphs: [
                    "Therapy is your space — a safe environment to explore the challenges that matter most to you. My role is to walk alongside you, helping you uncover answers within yourself and make meaningful change.",
                    "I work with all ages and have a unique background in athletics, with a passion for supporting collegiate student athletes — understanding the pressure of balancing performance and personal life, and helping build resilience, purpose, and identity."
                ]},
                { title: "Areas of Expertise", icon: "fa-tools", tags: [
                    "Anxiety", "Depression", "Trauma", "Life Transitions", "Emotional Regulation",
                    "Collegiate Student Athletes", "Resilience & Identity", "Personal Growth"
                ]},
                { title: "Education & Credentials", icon: "fa-graduation-cap", tags: [
                    "MS", "MHC-LP", "LPC-A", "Person-Centered & Collaborative Approach"
                ]}
            ]
        },
        {
            name: "Cloe D'Arcangelo",
            role: "Supervised Psychotherapist",
            img: "../CloeDArcangelo.jpeg",
            specialty: "Eating Disorders, Anxiety & Identity",
            blurb: "Integrative support for eating disorders, anxiety, self-esteem, relationships, and life transitions.",
            sections: [
                { title: "About", icon: "fa-heart-pulse", paragraphs: [
                    "I work with teens and adults navigating relationships, identity, and life transitions, often across different cultural backgrounds or expectations. I'm attentive to each person's inner world and the private logic through which they make sense of their experience, and I work in a way that affirms neurodivergent ways of thinking and being.",
                    "I believe in the power of personalized support and evidence-based techniques to help you overcome obstacles and build a healthier, more fulfilling life."
                ]},
                { title: "Areas of Expertise", icon: "fa-tools", tags: [
                    "Eating Disorders", "Anxiety", "Self-Esteem", "Relationships",
                    "Identity", "Life Transitions", "Neurodivergent-Affirming Care"
                ]},
                { title: "Education & Credentials", icon: "fa-graduation-cap", tags: [
                    "MA in Psychology", "Supervised Psychotherapist"
                ]}
            ]
        },
        {
            name: "Tiffany Aguilar",
            role: "Pre-Licensed Mental Health Counselor",
            img: "https://photos.psychologytoday.com/cb438ffb-4660-4dfe-9ea0-63e2115d560e/1/320x400.png",
            specialty: "Children, Adolescents & Behavioral Health",
            blurb: "Counselor in training with 7+ years supporting children and adolescents via evidence-based care.",
            sections: [
                { title: "About", icon: "fa-heart-pulse", paragraphs: [
                    "You don't need to have everything figured out to start therapy. Whether you're seeking support for anxiety, depression, or the effects of trauma, therapy can provide a safe space to understand your emotions and develop coping skills.",
                    "I'm a mental health counselor in training with 7+ years working with children and adolescents. With a background in Applied Behavioral Analysis, I combine evidence-based interventions with skill-building to improve emotional regulation, communication, and daily functioning."
                ]},
                { title: "Areas of Expertise", icon: "fa-tools", tags: [
                    "Behavioral Issues", "Depression & Anxiety", "Autism & ABA",
                    "Coping Skills", "Emotional Regulation", "Children & Adolescents"
                ]},
                { title: "Credentials", icon: "fa-graduation-cap", tags: [
                    "Pre-Licensed Professional", "Mental Health Counselor in Training", "ABA Background"
                ]}
            ]
        },
        {
            name: "Makeda Andrew",
            role: "Pre-Licensed Mental Health Counselor",
            img: "https://photos.psychologytoday.com/a20256e6-eed6-4669-aa07-ef93969acd37/1/320x400.jpeg",
            specialty: "Anxiety, Grief & Trauma",
            blurb: "Compassionate counselor grounded in Person-Centered Therapy and CBT, supporting diverse populations.",
            sections: [
                { title: "About", icon: "fa-heart-pulse", paragraphs: [
                    "Seeking support is a courageous step, and I'd be honored to be part of your journey toward greater self-awareness and emotional wellness. I'm a compassionate counselor with a strong background in healthcare, client support, and crisis response, dedicated to supporting diverse populations.",
                    "My approach is grounded in Person-Centered Therapy and CBT. I create a collaborative, supportive environment where clients feel heard and understood, and we work at your own pace toward meaningful, lasting change."
                ]},
                { title: "Areas of Expertise", icon: "fa-tools", tags: [
                    "Anxiety & Stress", "Grief & Life Coaching", "Trauma & PTSD",
                    "Women's Issues", "Relationships", "Self-Esteem"
                ]},
                { title: "Therapeutic Approaches", icon: "fa-graduation-cap", tags: [
                    "Person-Centered Therapy", "CBT", "Active Listening", "Culturally Aware Practice"
                ]}
            ]
        },
        {
            name: "Defne Sagdic",
            role: "Pre-Licensed Professional",
            img: "https://photos.psychologytoday.com/231a202e-58ad-452f-917d-8ecb854a113b/2/320x400.jpeg",
            specialty: "Creative Arts Therapy & Trauma",
            blurb: "Bilingual therapist using creative expression and a holistic lens for trauma and identity work.",
            sections: [
                { title: "About", icon: "fa-heart-pulse", paragraphs: [
                    "When words aren't enough, healing can come through creativity, connection, and care. In therapy, I offer a space where creative expression honors your story and supports your healing.",
                    "Viewing each person through a systemic and holistic lens lets me understand the many layers of identity, experience, and meaning that shape who you are."
                ]},
                { title: "Areas of Expertise", icon: "fa-tools", tags: [
                    "Trauma Healing", "Identity & Immigration", "Survivors of Violence",
                    "Expressive Arts Therapy", "Teens & Adults"
                ]},
                { title: "Credentials", icon: "fa-graduation-cap", tags: [
                    "Pre-Licensed Professional", "Bilingual Therapist", "Creative Arts Therapy"
                ]}
            ]
        },
        {
            name: "Shameen Joshi",
            role: "Pre-Licensed Mental Health Counselor",
            img: "https://openpathcollective.org/wp-content/uploads/IMG_0012-rotated.jpg",
            specialty: "Self-Esteem, Body Image & Trauma",
            blurb: "Warm, nonjudgmental support for stress, anxiety, relationships, and major life transitions.",
            sections: [
                { title: "About", icon: "fa-heart-pulse", paragraphs: [
                    "I'm dedicated to creating a warm, supportive, nonjudgmental space where clients feel truly heard. Therapy is a collaborative journey toward healing and self-discovery, and my goal is to help you navigate life's challenges with compassion and clarity.",
                    "Whether you're facing stress, anxiety, relationship issues, or major life transitions, I strive to provide a safe environment that promotes growth, emotional balance, and lasting positive change."
                ]},
                { title: "Areas of Expertise", icon: "fa-tools", tags: [
                    "Body Image", "Self-Esteem", "Trauma & PTSD", "Stress & Anxiety",
                    "Relationships", "Life Transitions"
                ]},
                { title: "Credentials", icon: "fa-graduation-cap", tags: [
                    "Pre-Licensed Professional", "Mental Health Counselor"
                ]}
            ]
        }
    ];

    /* ------------------------------------------------------------------ */
    document.addEventListener('DOMContentLoaded', function () {
        renderCards();
        initModal();
    });

    /* Build the grid ------------------------------------------------------ */
    function renderCards() {
        var grid = document.getElementById('membersGrid');
        if (!grid) return;

        var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        var frag = document.createDocumentFragment();

        TEAM.forEach(function (m, i) {
            var card = document.createElement('article');
            card.className = 'member-card' + (reduce ? ' in-view' : '');
            card.style.transitionDelay = (Math.min(i, 8) * 0.05) + 's';

            card.innerHTML =
                '<div class="mc-image"><img src="' + m.img + '" alt="' + escapeAttr(m.name) + '" loading="lazy"></div>' +
                '<div class="mc-info">' +
                    '<h3>' + escapeHtml(m.name) + '</h3>' +
                    '<div class="mc-role">' + escapeHtml(m.role) + '</div>' +
                    '<p class="mc-blurb">' + escapeHtml(m.blurb) + '</p>' +
                    '<button class="mc-btn" type="button">View Full Profile <i class="fas fa-arrow-right"></i></button>' +
                '</div>';

            card.querySelector('.mc-btn').addEventListener('click', function () { openModal(m); });
            frag.appendChild(card);
        });

        grid.appendChild(frag);

        // Reveal cards on scroll (mirrors script.js .reveal behavior).
        if (!reduce && 'IntersectionObserver' in window) {
            var io = new IntersectionObserver(function (entries, obs) {
                entries.forEach(function (e) {
                    if (e.isIntersecting) { e.target.classList.add('in-view'); obs.unobserve(e.target); }
                });
            }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
            grid.querySelectorAll('.member-card').forEach(function (c) { io.observe(c); });
        } else {
            grid.querySelectorAll('.member-card').forEach(function (c) { c.classList.add('in-view'); });
        }
    }

    /* Modal --------------------------------------------------------------- */
    var modal, lastFocus;

    function initModal() {
        modal = document.getElementById('memberModal');
        if (!modal) return;

        modal.querySelectorAll('[data-close]').forEach(function (el) {
            el.addEventListener('click', closeModal);
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
        });
    }

    function openModal(m) {
        if (!modal) return;
        lastFocus = document.activeElement;

        modal.querySelector('#mmImage').src = m.img;
        modal.querySelector('#mmImage').alt = m.name;
        modal.querySelector('#mmName').textContent = m.name;
        modal.querySelector('#mmTitle').textContent = m.role;
        modal.querySelector('#mmSpecialty').textContent = m.specialty;

        var wrap = modal.querySelector('#mmSections');
        wrap.innerHTML = '';

        m.sections.forEach(function (s) {
            var sec = document.createElement('div');
            sec.className = 'mm-section';
            var html = '<h3><i class="fas ' + (s.icon || 'fa-circle') + '"></i> ' + escapeHtml(s.title) + '</h3>';
            if (s.paragraphs) s.paragraphs.forEach(function (p) { html += '<p>' + escapeHtml(p) + '</p>'; });
            if (s.tags) {
                html += '<div class="mm-tags">';
                s.tags.forEach(function (t) { html += '<span>' + escapeHtml(t) + '</span>'; });
                html += '</div>';
            }
            sec.innerHTML = html;
            wrap.appendChild(sec);
        });

        modal.querySelector('.mm-dialog').scrollTop = 0;
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        modal.querySelector('.mm-close').focus();
    }

    function closeModal() {
        if (!modal) return;
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
    }

    /* Helpers ------------------------------------------------------------- */
    function escapeHtml(str) {
        return String(str).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }
    function escapeAttr(str) { return escapeHtml(str); }
})();
