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
export type NavKey = 'about' | 'contact' | 'services' | 'blog';

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
        title: 'About Us - LB & CO Global Advisors',
        description: 'Learn about LB & CO Global Advisors, our mission, and our team.',
      },
      services: {
        title: 'Services - LB & CO Global Advisors',
        description:
          'Income tax preparation, business accounting, payroll, and IRS tax problem resolution services from LB & CO Global Advisors.',
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
        'We deliver independent, data-driven advisory and valuation services to help businesses, investors, and professionals make informed decisions across the United States.',
      book: 'Book a Consultation',
      explore: 'Explore Our Services',
      trustLocation: 'Serving clients across the United States',
      trustValues: 'Independent. Objective. Trusted.',
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
        eyebrow: 'Who We Are',
        title: 'About LB & CO Global Advisors',
        lead:
          'LB & CO Global Advisors is an independent firm specializing in business advisory, valuations, and financial guidance. We are committed to objectivity, integrity, and data-driven insights that empower our clients to make confident decisions.',
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
        title: 'Sobre nosotros - LB & CO Global Advisors',
        description: 'Conoce LB & CO Global Advisors, nuestra misión y nuestro equipo.',
      },
      services: {
        title: 'Servicios - LB & CO Global Advisors',
        description:
          'Servicios de preparación de impuestos, contabilidad para negocios, nómina y resolución de problemas fiscales con el IRS de LB & CO Global Advisors.',
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
        'Ofrecemos servicios independientes de asesoramiento y valoración basados en datos para ayudar a empresas, inversores y profesionales a tomar decisiones informadas en Estados Unidos.',
      book: 'Reservar una consulta',
      explore: 'Ver servicios',
      trustLocation: 'Atendemos a clientes en Estados Unidos',
      trustValues: 'Independientes. Objetivos. De confianza.',
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
        eyebrow: 'Quiénes somos',
        title: 'Sobre LB & CO Global Advisors',
        lead:
          'LB & CO Global Advisors es una firma independiente especializada en asesoramiento empresarial, valoraciones y orientación financiera. Nos comprometemos con la objetividad, la integridad y el análisis basado en datos para que nuestros clientes tomen decisiones con confianza.',
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
      },
    },
  },
} as const;
