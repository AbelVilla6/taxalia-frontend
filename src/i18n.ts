export const languages = {
  en: {
    label: 'US',
    name: 'American English',
    htmlLang: 'en-US',
  },
  es: {
    label: 'ES',
    name: 'Español de España',
    htmlLang: 'es-ES',
  },
} as const;

export type Lang = keyof typeof languages;
export type NavKey = 'about' | 'contact' | 'services' | 'blog' | 'taxCalculator';

export const defaultLang: Lang = 'en';

export function basePathFromPathname(pathname: string): string {
  const trimmed = pathname.replace(/\/+$/, '') || '/';

  if (trimmed === '/es') {
    return '/';
  }

  if (trimmed.startsWith('/es/')) {
    return trimmed.slice(3) || '/';
  }

  return trimmed;
}

export function localizePath(lang: Lang, path: string): string {
  if (path.startsWith('#') || /^[a-z][a-z0-9+.-]*:/i.test(path)) {
    return path;
  }

  const normalizedPath = path === '/' ? '/' : `/${path.replace(/^\/+|\/+$/g, '')}`;

  if (lang === 'en') {
    return normalizedPath;
  }

  return normalizedPath === '/' ? '/es/' : `/es${normalizedPath}`;
}

export const ui = {
  en: {
    meta: {
      home: {
        title: 'LB & CO Global Advisors - Trusted Advisory. Insightful Valuations.',
        description:
          'Independent, data-driven advisory and valuation services to help businesses, investors, and professionals make informed decisions across the United States.',
      },
      about: {
        title: 'About Us - LB&Co Global Advisors',
        description:
          'U.S. tax and accounting services for Americans abroad who prefer clear, personalized support in Spanish.',
      },
      services: {
        title: 'Services - LB & CO Global Advisors',
        description:
          'Income tax preparation, business accounting, payroll, and IRS tax problem resolution services from LB & CO Global Advisors.',
      },
      taxCalculator: {
        title: 'Tax Calculator - LB & CO Global Advisors',
        description:
          'Estimate taxable income, federal tax, effective tax rate, and refund or amount owed with LB & CO Global Advisors.',
      },
      contact: {
        title: 'Contact Us - LB & CO Global Advisors',
        description:
          'Get in touch with LB & CO Global Advisors. Book a consultation or send us a message.',
      },
      blog: {
        title: 'Blog - LB & CO Global Advisors',
        description: 'Insights, analysis, and expert perspectives from LB & CO Global Advisors.',
      },
    },
    header: {
      homeLabel: 'LB & CO Global Advisors Home',
      navLabel: 'Main navigation',
      mobileNavLabel: 'Mobile navigation',
      menu: 'Americanos Hispanoparlantes en el extranjero',
      openMenu: 'Open menu',
      closeMenu: 'Close menu',
      languageSelector: 'Language selector',
      switchTo: {
        en: 'Switch to American English',
        es: 'Switch to Spanish from Spain',
      },
      nav: {
        about: 'About Us',
        contact: 'Contact Us',
        services: 'Services',
        blog: 'Blog',
        taxCalculator: 'Tax Calculator',
      },
      book: 'Book a Consultation',
    },
    homeBanner: {
      eyebrow: 'Limited welcome offer',
      title: 'Your first consultation is free',
      text: 'Click here and tell us your situation. We will help you find the right next step.',
      close: 'Close free consultation offer',
    },
    hero: {
      ariaLabel: 'Hero',
      kicker: 'About Us',
      title: ['Tax guidance for', 'Spanish‑speaking Americans', 'living abroad'],
      text:
        'We provide U.S. tax and accounting support for Americans abroad, with clear guidance in Spanish and practical help for cross-border compliance.',
      book: 'Book a Consultation',
      explore: 'Explore Our Services',
      trustLocation: 'Serving clients around the World',
      trustValues: 'Independent & Trusted.',
      imageAlt: 'Two advisors reviewing financial charts and data in a professional setting',
    },
    services: {
      eyebrow: 'Our Services',
      pageEyebrow: 'What We Do',
      pageTitle: 'Our Services',
      title: 'Tax and Accounting Services for People and Businesses Abroad',
      learnMore: 'Learn More',
      learnMoreAria: 'Learn more about',
      contactCta: 'Speak with an advisor',
      detailEyebrow: 'Services included',
      groups: [
        {
          slug: 'income-tax',
          title: 'Income Tax Return Preparation',
          description:
            'Personal, business, international, and expat tax return support designed to keep filings clear, accurate, and compliant.',
          href: '/services/income-tax',
          services: [
            {
              title: 'Income Tax Return Preparation Services',
              description: 'End-to-end preparation support for federal and applicable state income tax filings.',
            },
            {
              title: 'Personal Income Tax Preparation',
              description: 'Individual tax return preparation for residents, nonresidents, and taxpayers with cross-border considerations.',
            },
            {
              title: 'Business Income Tax Preparation',
              description: 'Tax preparation for business owners who need organized reporting and filing support.',
            },
            {
              title: 'International Taxpayer Preparation',
              description: 'Guidance for taxpayers with international income, assets, residency, or reporting obligations.',
            },
            {
              title: 'Expat Income Tax Services',
              description: 'Tax preparation support for Americans living abroad and families managing foreign income or exclusions.',
            },
            {
              title: 'Foreign Bank Account Reporting',
              description: 'Support for foreign account reporting requirements, including FBAR-related organization and filing guidance.',
            },
            {
              title: 'Tax Planning',
              description: 'Forward-looking planning to anticipate tax impact, avoid surprises, and make informed financial decisions.',
            },
          ],
        },
        {
          slug: 'business-accounting',
          title: 'Business Accounting',
          description:
            'Accounting, corporate tax preparation, small business bookkeeping, and payroll support for growing companies.',
          href: '/services/business-accounting',
          services: [
            {
              title: 'Business Accounting Services',
              description: 'Ongoing accounting support to keep business records organized, decision-ready, and tax-ready.',
            },
            {
              title: 'Corporation Tax Preparation Service',
              description: 'Corporate tax preparation support for entities that need accurate filings and structured documentation.',
            },
            {
              title: 'Small Business Accounting',
              description: 'Bookkeeping and accounting support tailored to small businesses and owner-managed companies.',
            },
            {
              title: 'Payroll Service',
              description: 'Payroll support to help manage employee payments, records, and compliance workflows.',
            },
          ],
        },
        {
          slug: 'irs-tax-resolution',
          title: 'IRS Tax Problem Resolution',
          description:
            'Support for taxpayers facing IRS notices, balances, filing issues, or complex tax problems that need a clear resolution path.',
          href: '/services/irs-tax-resolution',
          services: [
            {
              title: 'IRS Tax Problem Resolution Services',
              description: 'Structured support to review IRS issues, understand available options, and define the next steps toward resolution.',
            },
          ],
        },
      ],
    },
    blog: {
      eyebrow: 'From Our Blog',
      title: 'Insights That Matter',
      readMore: 'Read More',
      posts: [
        {
          date: 'May 10, 2024',
          title: '2024 U.S. Real Estate Market Outlook: Key Trends and Opportunities',
          excerpt:
            'We break down the factors shaping the U.S. real estate market and what investors and business owners should watch.',
          href: '/blog/2024-us-real-estate-market-outlook',
          image: '/assets/images/blog-real-estate.webp',
          imageAlt: 'Aerial view of a major US city skyline at dusk',
        },
        {
          date: 'April 23, 2024',
          title: 'Business Valuation 101: What You Need to Know',
          excerpt:
            'A practical guide to understanding business valuation methods and how they support better decision-making.',
          href: '/blog/business-valuation-101',
          image: '/assets/images/blog-valuation.webp',
          imageAlt: 'Financial charts and pen on a desk',
        },
      ],
    },
    cta: {
      title: "Let's Work Together",
      lead: "Have questions or ready to get started? We're here to help.",
      getInTouch: 'Get in Touch',
      followUs: 'Follow us',
    },
    footer: {
      rights: 'All rights reserved.',
      independent: 'Independent',
      confidential: 'Confidential',
      excellence: 'Committed to Excellence',
      multilingual: 'Available in English and Spanish',
    },
    chat: {
      ariaLabel: 'AI Assistant',
      imageAlt: 'Lexi, AI Assistant',
      status: 'AI Assistant',
      open: 'Open chat widget',
      close: 'Close chat widget',
      bubble: "Hi! I'm Lexi, your AI Assistant. How can I help you today?",
      action: 'Ask a Question',
      placeholder: 'Type your message...',
      send: 'Send',
      sendAria: 'Send message',
      typing: 'Lexi is typing...',
      error: 'Sorry, something went wrong. Please try again.',
      personaName: 'Lexi',
      humanHandoff: 'Talk to a person',
      disclaimer: 'AI can make mistakes. This is only to help clarify your questions.',
      partialWarning: 'Some answers may be incomplete.',
    },
    pages: {
      about: {
        eyebrow: 'About Us',
        title: 'U.S. Tax & Accounting Services for Americans Abroad',
        lead:
          'At LB&Co Global Advisors, we specialize in U.S. tax and accounting services for Americans living abroad who prefer to communicate in Spanish.',
        intro: [
          'Living overseas does not eliminate your U.S. tax obligations, but understanding and managing those obligations should not be complicated by language barriers. Our mission is to help U.S. citizens, Green Card holders, and dual nationals navigate the complexities of the U.S. tax system with confidence, clarity, and personalized support in Spanish.',
          'With more than 10 years of experience serving expatriate clients, we understand the unique challenges faced by Americans living outside the United States. From annual tax returns and foreign income reporting to FBAR filings, tax planning, and compliance with international reporting requirements, we provide practical solutions tailored to each client\'s circumstances.',
          'What sets us apart is our ability to combine technical expertise with clear communication. We know that many Spanish-speaking Americans abroad struggle to find a tax professional who not only understands U.S. tax law but can also explain it in their native language. At LB&Co Global Advisors, we make complex tax matters easy to understand, so you always know where you stand and what comes next.',
        ],
        whoWeServe: {
          eyebrow: 'Who We Serve',
          title: 'We work with',
          items: [
            'U.S. citizens living abroad',
            'Green Card holders residing outside the United States',
            'Dual citizens',
            'Spanish-speaking expatriates and international families',
            'Freelancers, consultants, and self-employed professionals',
            'Small business owners with international tax considerations',
          ],
        },
        whyChoose: {
          eyebrow: 'Why Choose LB&Co Global Advisors',
          title: 'Why clients choose us',
          intro:
            'At LB&Co Global Advisors, we believe that every American abroad deserves access to high-quality tax and accounting services in a language they fully understand. Our goal is to simplify compliance, reduce stress, and help you stay focused on building your life wherever in the world you call home.',
          items: [
            'More than 10 years of experience serving Americans abroad',
            'Specialized expertise in U.S. expatriate taxation',
            'Native Spanish-speaking professional',
            'Personalized, responsive service',
            'Clear guidance without unnecessary tax jargon',
            'Secure, fully remote services worldwide',
          ],
        },
        closing:
          'Helping Americans abroad navigate U.S. taxes—with expert guidance in Spanish.',
        imageAlt: 'LB&Co Global Advisors professional portrait',
      },
      contact: {
        eyebrow: 'Get In Touch',
        title: 'Contact Us',
        consultation: 'Book a Consultation',
        name: 'Full Name',
        namePlaceholder: 'Your full name',
        email: 'Email Address',
        emailPlaceholder: 'you@company.com',
        message: 'Message',
        messagePlaceholder: 'Tell us about your needs...',
        send: 'Send Message',
        sending: 'Sending...',
        success: 'Thanks — your message has been sent. We will get back to you soon.',
        error:
          'Sorry, we could not send your message right now. Please try again or email us directly at info@hitaxalia.com.',
        note: 'We usually respond within one business day.',
      },
      taxCalculator: {
        eyebrow: 'Tax Calculator',
        title: 'Estimate Your U.S. Federal Tax',
        lead:
          'Enter a few numbers to estimate taxable income, federal income tax, effective tax rate, and whether you may receive a refund or owe more.',
        disclaimer:
          'This calculator is an educational estimate based on simplified 2025 federal brackets and standard deduction defaults. It is not tax advice and does not include state tax, AMT, self-employment tax, foreign exclusions, treaty positions, penalties, or every IRS rule.',
        formHelp:
          'Deductions start with the standard deduction for the selected filing status. You can replace that amount if you expect itemized deductions or a different deduction profile.',
        fields: {
          filingStatus: 'Filing status',
          income: 'Total income',
          deductions: 'Deductions',
          credits: 'Tax credits',
          withholding: 'Federal withholding / payments',
        },
        statuses: {
          single: 'Single',
          marriedJoint: 'Married filing jointly',
          marriedSeparate: 'Married filing separately',
          headOfHousehold: 'Head of household',
        },
        results: {
          eyebrow: 'Estimated result',
          taxableIncome: 'Taxable income',
          estimatedTax: 'Estimated federal tax',
          effectiveRate: 'Effective tax rate',
          refund: 'Estimated refund',
          owed: 'Estimated amount owed',
          note:
            'Use this as a planning signal only. For U.S. taxpayers abroad, foreign income, credits, exclusions, and reporting obligations can materially change the result.',
        },
      },
    },
  },
  es: {
    meta: {
      home: {
        title: 'LB & CO Global Advisors - Asesoramiento fiable. Valoraciones claras.',
        description:
          'Servicios independientes de asesoramiento y valoración basados en datos para ayudar a empresas, inversores y profesionales a tomar decisiones informadas en Estados Unidos.',
      },
      about: {
        title: 'Sobre nosotros - LB&Co Global Advisors',
        description:
          'Servicios de impuestos y contabilidad de EE. UU. para estadounidenses en el extranjero con atención clara y personalizada en español.',
      },
      services: {
        title: 'Servicios - LB & CO Global Advisors',
        description:
          'Servicios de preparación de impuestos, contabilidad para negocios, nómina y resolución de problemas fiscales con el IRS de LB & CO Global Advisors.',
      },
      taxCalculator: {
        title: 'Calculadora de impuestos - LB & CO Global Advisors',
        description:
          'Estima ingresos imponibles, impuesto federal, tasa efectiva y reembolso o saldo a pagar con LB & CO Global Advisors.',
      },
      contact: {
        title: 'Contacto - LB & CO Global Advisors',
        description:
          'Contacta con LB & CO Global Advisors. Reserva una consulta o envíanos un mensaje.',
      },
      blog: {
        title: 'Blog - LB & CO Global Advisors',
        description:
          'Análisis, perspectivas y opinión experta de LB & CO Global Advisors.',
      },
    },
    header: {
      homeLabel: 'Inicio de LB & CO Global Advisors',
      navLabel: 'Navegación principal',
      mobileNavLabel: 'Navegación móvil',
      menu: 'Americanos Hispanoparlantes en el extranjero',
      openMenu: 'Abrir menú',
      closeMenu: 'Cerrar menú',
      languageSelector: 'Selector de idioma',
      switchTo: {
        en: 'Cambiar a inglés estadounidense',
        es: 'Cambiar a español de España',
      },
      nav: {
        about: 'Sobre nosotros',
        contact: 'Contacto',
        services: 'Servicios',
        blog: 'Blog',
        taxCalculator: 'Calculadora fiscal',
      },
      book: 'Reservar una consulta',
    },
    homeBanner: {
      eyebrow: 'Oferta de bienvenida',
      title: 'Tu primera consulta es gratuita',
      text: 'Haz click aquí y cuéntanos tu situación. Te ayudamos a encontrar el siguiente paso adecuado.',
      close: 'Cerrar oferta de primera consulta gratuita',
    },
    hero: {
      ariaLabel: 'Hero',
      kicker: 'Sobre nosotros',
      title: ['Orientación fiscal para', 'americanos hispanoparlantes', 'en el extranjero'],
      text:
        'Ofrecemos servicios de impuestos y contabilidad de EE. UU. para estadounidenses en el extranjero, con orientación clara en español y apoyo práctico para el cumplimiento internacional.',
      book: 'Reservar una consulta',
      explore: 'Ver servicios',
      trustLocation: 'Atendemos a clientes por todo el mundo',
      trustValues: 'Independientes y de confianza.',
      imageAlt:
        'Dos asesores revisando gráficos financieros y datos en un entorno profesional',
    },
    services: {
      eyebrow: 'Nuestros servicios',
      pageEyebrow: 'Qué hacemos',
      pageTitle: 'Nuestros servicios',
      title: 'Servicios fiscales y contables para personas y negocios en el extranjero',
      learnMore: 'Saber más',
      learnMoreAria: 'Saber más sobre',
      contactCta: 'Hablar con un asesor',
      detailEyebrow: 'Servicios incluidos',
      groups: [
        {
          slug: 'income-tax',
          title: 'Preparación de declaraciones de impuestos',
          description:
            'Soporte para declaraciones personales, empresariales, internacionales y de expatriados con foco en claridad y cumplimiento.',
          href: '/services/income-tax',
          services: [
            {
              title: 'Preparación de declaraciones de impuestos',
              description: 'Preparación integral de declaraciones federales y estatales aplicables.',
            },
            {
              title: 'Preparación de impuestos personales',
              description: 'Declaraciones individuales para residentes, no residentes y contribuyentes con factores internacionales.',
            },
            {
              title: 'Preparación de impuestos para negocios',
              description: 'Soporte fiscal para propietarios y empresas que necesitan información ordenada y precisa.',
            },
            {
              title: 'Preparación para contribuyentes internacionales',
              description: 'Orientación para ingresos, activos, residencia u obligaciones de reporte internacionales.',
            },
            {
              title: 'Servicios de impuestos para expatriados',
              description: 'Soporte para estadounidenses en el extranjero y familias con ingresos o exclusiones internacionales.',
            },
            {
              title: 'Reporte de cuentas bancarias extranjeras',
              description: 'Apoyo con obligaciones de reporte de cuentas extranjeras, incluyendo organización para FBAR.',
            },
            {
              title: 'Planificación fiscal',
              description: 'Planificación anticipada para reducir sorpresas y tomar mejores decisiones financieras.',
            },
          ],
        },
        {
          slug: 'business-accounting',
          title: 'Contabilidad para negocios',
          description:
            'Contabilidad, preparación fiscal corporativa, apoyo para pequeños negocios y servicios de nómina.',
          href: '/services/business-accounting',
          services: [
            {
              title: 'Servicios de contabilidad para negocios',
              description: 'Soporte contable continuo para mantener registros claros, útiles y listos para impuestos.',
            },
            {
              title: 'Preparación de impuestos corporativos',
              description: 'Apoyo en declaraciones corporativas con documentación estructurada y precisa.',
            },
            {
              title: 'Contabilidad para pequeñas empresas',
              description: 'Bookkeeping y contabilidad adaptados a pequeñas empresas y negocios gestionados por sus dueños.',
            },
            {
              title: 'Servicio de nómina',
              description: 'Apoyo para gestionar pagos, registros y procesos de nómina con orden y cumplimiento.',
            },
          ],
        },
        {
          slug: 'irs-tax-resolution',
          title: 'Resolución de problemas fiscales con el IRS',
          description:
            'Soporte para contribuyentes con avisos del IRS, saldos pendientes, declaraciones atrasadas o situaciones fiscales complejas.',
          href: '/services/irs-tax-resolution',
          services: [
            {
              title: 'Servicios de resolución de problemas fiscales con el IRS',
              description: 'Revisión de la situación, explicación de opciones disponibles y definición de próximos pasos para resolver el problema.',
            },
          ],
        },
      ],
    },
    blog: {
      eyebrow: 'Desde nuestro blog',
      title: 'Ideas que importan',
      readMore: 'Leer más',
      posts: [
        {
          date: '10 de mayo de 2024',
          title:
            'Perspectivas del mercado inmobiliario de EE. UU. en 2024: tendencias y oportunidades',
          excerpt:
            'Analizamos los factores que están dando forma al mercado inmobiliario de EE. UU. y lo que inversores y empresas deben tener en cuenta.',
          href: '/blog/2024-us-real-estate-market-outlook',
          image: '/assets/images/blog-real-estate.webp',
          imageAlt: 'Vista aérea de una gran ciudad estadounidense al atardecer',
        },
        {
          date: '23 de abril de 2024',
          title: 'Valoración de empresas 101: lo que necesitas saber',
          excerpt:
            'Una guía práctica para entender los métodos de valoración de empresas y cómo ayudan a tomar mejores decisiones.',
          href: '/blog/business-valuation-101',
          image: '/assets/images/blog-valuation.webp',
          imageAlt: 'Gráficos financieros y un bolígrafo sobre un escritorio',
        },
      ],
    },
    cta: {
      title: 'Trabajemos juntos',
      lead: '¿Tienes preguntas o quieres empezar? Estamos aquí para ayudarte.',
      getInTouch: 'Contactar',
      followUs: 'Síguenos',
    },
    footer: {
      rights: 'Todos los derechos reservados.',
      independent: 'Independientes',
      confidential: 'Confidencial',
      excellence: 'Compromiso con la excelencia',
      multilingual: 'Disponible en inglés y español',
    },
    chat: {
      ariaLabel: 'Asistente de IA',
      imageAlt: 'Lexi, asistente de IA',
      status: 'Asistente de IA',
      open: 'Abrir widget de chat',
      close: 'Cerrar widget de chat',
      bubble: 'Hola, soy Lexi, tu asistente de IA. ¿Cómo puedo ayudarte hoy?',
      action: 'Hacer una pregunta',
      placeholder: 'Escribe tu mensaje...',
      send: 'Enviar',
      sendAria: 'Enviar mensaje',
      typing: 'Lexi está escribiendo...',
      error: 'Lo siento, algo salió mal. Inténtalo de nuevo.',
      personaName: 'Lexi',
      humanHandoff: 'Hablar con una persona',
      disclaimer: 'La IA puede equivocarse.',
      partialWarning: 'Algunas respuestas pueden estar incompletas.',
    },
    pages: {
      about: {
        eyebrow: 'Sobre nosotros',
        title: 'Servicios de impuestos y contabilidad de EE. UU. para estadounidenses en el extranjero',
        lead:
          'En LB&Co Global Advisors, nos especializamos en servicios de impuestos y contabilidad de EE. UU. para estadounidenses que viven en el extranjero y prefieren comunicarse en español.',
        intro: [
          'Vivir fuera de EE. UU. no elimina tus obligaciones fiscales con el país, pero entender y gestionar esas obligaciones no debería complicarse por barreras de idioma. Nuestra misión es ayudar a ciudadanos estadounidenses, titulares de Green Card y personas con doble nacionalidad a navegar la complejidad del sistema fiscal de EE. UU. con confianza, claridad y acompañamiento personalizado en español.',
          'Con más de 10 años de experiencia atendiendo a clientes expatriados, entendemos los retos únicos que enfrentan los estadounidenses que viven fuera de Estados Unidos. Desde declaraciones anuales y reportes de ingresos del extranjero hasta presentaciones FBAR, planificación fiscal y cumplimiento de requisitos internacionales de información, ofrecemos soluciones prácticas adaptadas a la situación de cada cliente.',
          'Lo que nos diferencia es nuestra capacidad para combinar experiencia técnica con una comunicación clara. Sabemos que muchos estadounidenses hispanohablantes en el extranjero tienen dificultades para encontrar un profesional que no solo entienda la normativa fiscal estadounidense, sino que también pueda explicarla en su idioma. En LB&Co Global Advisors, hacemos que los temas fiscales complejos sean fáciles de entender, para que siempre sepas dónde estás y qué sigue.',
        ],
        whoWeServe: {
          eyebrow: 'A quién ayudamos',
          title: 'Trabajamos con',
          items: [
            'Ciudadanos estadounidenses que viven en el extranjero',
            'Titulares de Green Card que residen fuera de Estados Unidos',
            'Personas con doble nacionalidad',
            'Expatriados hispanohablantes y familias internacionales',
            'Freelancers, consultores y profesionales autónomos',
            'Pequeños negocios con consideraciones fiscales internacionales',
          ],
        },
        whyChoose: {
          eyebrow: 'Por qué elegir LB&Co Global Advisors',
          title: 'Por qué nuestros clientes nos eligen',
          intro:
            'En LB&Co Global Advisors creemos que todo estadounidense en el extranjero merece acceso a servicios fiscales y contables de alta calidad en un idioma que comprenda plenamente. Nuestro objetivo es simplificar el cumplimiento, reducir el estrés y ayudarte a concentrarte en construir tu vida dondequiera que llames hogar.',
          items: [
            'Más de 10 años de experiencia atendiendo a estadounidenses en el extranjero',
            'Experiencia especializada en tributación de expatriados en EE. UU.',
            'Profesional nativa de habla hispana',
            'Servicio personalizado y ágil',
            'Orientación clara, sin jerga fiscal innecesaria',
            'Servicios remotos y seguros en todo el mundo',
          ],
        },
        closing:
          'Ayudando a estadounidenses en el extranjero a navegar los impuestos de EE. UU. con orientación experta en español.',
        imageAlt: 'Retrato profesional de LB&Co Global Advisors',
      },
      contact: {
        eyebrow: 'Ponte en contacto',
        title: 'Contacto',
        consultation: 'Reservar una consulta',
        name: 'Nombre completo',
        namePlaceholder: 'Tu nombre completo',
        email: 'Correo electrónico',
        emailPlaceholder: 'tu@empresa.com',
        message: 'Mensaje',
        messagePlaceholder: 'Cuéntanos qué necesitas...',
        send: 'Enviar mensaje',
        sending: 'Enviando...',
        success: 'Gracias — tu mensaje fue enviado. Te responderemos pronto.',
        error:
          'Lo siento, no pudimos enviar tu mensaje ahora mismo. Volvé a intentarlo o escribinos directamente a info@hitaxalia.com.',
        note: 'Normalmente respondemos dentro de un día hábil.',
      },
      taxCalculator: {
        eyebrow: 'Calculadora fiscal',
        title: 'Estima tu impuesto federal de EE. UU.',
        lead:
          'Ingresa algunos datos para estimar ingresos imponibles, impuesto federal sobre la renta, tasa efectiva y si podrías recibir un reembolso o tener saldo a pagar.',
        disclaimer:
          'Esta calculadora es una estimación educativa basada en tramos federales simplificados de 2025 y deducciones estándar por defecto. No es asesoramiento fiscal y no incluye impuestos estatales, AMT, impuesto de autónomos, exclusiones de ingresos extranjeros, tratados, multas ni todas las reglas del IRS.',
        formHelp:
          'Las deducciones empiezan con la deducción estándar para el estado civil seleccionado. Puedes reemplazar ese importe si esperas deducciones detalladas u otro perfil de deducciones.',
        fields: {
          filingStatus: 'Estado civil fiscal',
          income: 'Ingresos totales',
          deductions: 'Deducciones',
          credits: 'Créditos fiscales',
          withholding: 'Retenciones / pagos federales',
        },
        statuses: {
          single: 'Soltero/a',
          marriedJoint: 'Casados con declaración conjunta',
          marriedSeparate: 'Casados con declaración separada',
          headOfHousehold: 'Cabeza de familia',
        },
        results: {
          eyebrow: 'Resultado estimado',
          taxableIncome: 'Ingresos imponibles',
          estimatedTax: 'Impuesto federal estimado',
          effectiveRate: 'Tasa efectiva',
          refund: 'Reembolso estimado',
          owed: 'Saldo estimado a pagar',
          note:
            'Úsalo solo como una señal de planificación. Para contribuyentes estadounidenses en el extranjero, ingresos del exterior, créditos, exclusiones y obligaciones de reporte pueden cambiar materialmente el resultado.',
        },
      },
    },
  },
} as const;
