export type Language = {
  code: 'es' | 'en' | 'fr' | 'it' | 'de'
  flag: string
  name: string
}

export type LanguageCode = 'es' | 'en' | 'fr' | 'it' | 'de'

export interface I18nContextType {
  t: (key: string) => string
  translations: Translations
  currentLanguage: LanguageCode
  changeLanguage: (language: Language) => Promise<void>
  isLoading: boolean
  availableLanguages: Language[]
}

export interface Translations {
  common: {
    mockup: string;
    save: string;
    cancel: string;
    close: string;
    notSpecified: string;
    backTo: string;
  };
  header: {
    nav: {
      home: string;
      favorites: string;
      becomeCreator: string;
      create: string;
      analytics: string;
      exclusive: string;
    };
    search: {
      placeholder: string;
      ariaLabel: string;
    };
    auth: {
      button: string;
    };
    menu: {
      toggle: string;
      close: string;
      mobileNavLabel: string;
      mainNavLabel: string;
    };
    premium: {
      upgrade: string;
    };
    userMenu: {
      profile: string;
      logout: string;
      monetization: string;
      exclusiveContent: string;
      manageSubscription: string;
      controlPanel: string;
    };
    notifications: {
      title: string;
      seeAll: string;
      ariaLabel: string;
      adminAriaLabel: string;
    };
    tooltips: {
      profileMenu: string;
    };
    userTypes: {
      user: string;
      basic: string;
      premium: string;
      creator: string;
      admin: string;
    };
  };
  hero: {
    title: {
      prefix: string;
      accent: string;
    };
    subtitle: string;
    buttons: {
      start: string;
      plans: string;
    };
  };
  media: {
    sections: {
      recentVideos: string;
      recentAudios: string;
    };
  };
  auth: {
    backToHome: string;
    success: {
      login: string;
    };
    welcome: string;
    loading: string;
    email: string;
    errors: {
      invalidCredentials: string;
      emailNotVerified: string;
      accountBlocked: string;
      mfaRequired: string;
      networkError: string;
      loginFailed: string;
    };
    branding: {
      tagline: string;
      features: {
        exclusive: {
          title: string;
          desc: string;
        };
        multiplatform: {
          title: string;
          desc: string;
        };
        streaming: {
          title: string;
          desc: string;
        };
      };
      stats: {
        creators: string;
        users: string;
        content: string;
      };
    };
    switch: {
      haveAccount: string;
      signIn: string;
      noAccount: string;
      signUp: string;
    };
    buttons: {
      login: string;
      register: string;
    };
    registration: {
      steps: {
        step1: string;
        step2: string;
        progress: string;
      };
      fields: {
        email: string;
        password: string;
        repeatPassword: string;
        firstName: string;
        lastName: string;
        alias: string;
        birthDate: string;
        profileImage: string;
      };
      placeholders: {
        email: string;
        password: string;
        repeatPassword: string;
        firstName: string;
        lastName: string;
        alias: string;
        birthDate: string;
      };
      plans: {
        standard: {
          title: string;
          subtitle: string;
          price: string;
          features: string[];
        };
        premium: {
          title: string;
          subtitle: string;
          price: string;
          features: string[];
        };
      };
      navigation: {
        next: string;
        previous: string;
        finish: string;
      };
      errors: {
        passwordMismatch: string;
        requiredFields: string;
        passwordTooWeak: string;
        passwordCompromised: string;
        passwordTooShort: string;
        passwordStrengthDefault: string;
      };
    };
    password: {
      show: string;
      hide: string;
      changeButton: string;
      checkingHIBP: string;
      compromised: string;
      error: string;
      forgot: string;
      mismatch: string;
      newTitle: string;
      resetMessage: string;
      resetTitle: string;
      sendLink: string;
      weak: string;
    };
    forms: {
      email: string;
      password: string;
      repeatPassword: string;
      placeholders: {
        email: string;
        password: string;
        repeatPassword: string;
      };
    };
    verify: {
      loading: {
        title: string;
        message: string;
      };
      success: {
        title: string;
        message: string;
      };
      error: {
        title: string;
        message: string;
      };
      goHome: string;
      goLogin: string;
    };
    recover: {
      title: string;
      subtitle: string;
      labels: {
        newPassword: string;
        repeatPassword: string;
      };
      placeholders: {
        newPassword: string;
        repeatPassword: string;
      };
      submit: string;
      success: string;
      errors: {
        passwordTooWeak: string;
        general: string;
      };
    };
  };
  plans: {
    title: string;
    subtitle: string;
    standard: {
      title: string;
      subtitle: string;
      price: string;
      features: {
        0: string;
        1: string;
        2: string;
      };
    };
    premium: {
      title: string;
      subtitle: string;
      price: string;
      features: {
        0: string;
        1: string;
        2: string;
        3: string;
        4: string;
        5: string;
      };
    };
    buttons: {
      premium: string;
      standard: string;
    };
    badge: {
      recommended: string;
    };
    info: {
      whyChoose: {
        title: string;
        benefits: {
          original: {
            title: string;
            description: string;
          };
          multiplatform: {
            title: string;
            description: string;
          };
          noCommitments: {
            title: string;
            description: string;
          };
        };
      };
      faq: {
        title: string;
        questions: {
          changePlan: {
            question: string;
            answer: string;
          };
          freeTrial: {
            question: string;
            answer: string;
          };
        };
      };
    };
  };
  creator: {
    form: {
      title: string;
      subtitle: string;
      backToHome: string;
      sections: {
        personalInfo: string;
        channelInfo: string;
        photo: string;
      };
      fields: {
        email: string;
        firstName: string;
        lastName: string;
        alias: string;
        channelDescription: string;
        contentType: string;
        specialty: string;
      };
      placeholders: {
        email: string;
        firstName: string;
        lastName: string;
        alias: string;
        channelDescription: string;
      };
      photo: {
        placeholder: string;
        uploadButton: string;
      };
      submitButton: string;
      submitting: string;
      disclaimer: string;
      success: string;
      errors: {
        required: string;
        invalidEmail: string;
        submitError: string;
      };
    };
    branding: {
      tagline: string;
      features: {
        platform: {
          title: string;
          desc: string;
        };
        monetization: {
          title: string;
          desc: string;
        };
        growth: {
          title: string;
          desc: string;
        };
      };
      stats: {
        creators: string;
        audience: string;
        earnings: string;
      };
    };
    dashboard: {
      title: string;
      welcome: string;
    };
    channel: {
      info: {
        title: string;
        edit: string;
        save: string;
        cancel: string;
      };
      description: string;
      specialty: string;
      descriptionPlaceholder: string;
      specialtyPlaceholder: string;
      contentType: string;
      specialties: Record<string, string>;
      contentTypes: Record<string, string>;
    };
    upload: {
      title: string;
      audioDescription: string;
      selectAudioFile: string;
      videoUrlPlaceholder: string;
      uploadVideo: string;
    };
    metrics: {
      title: string;
      period: string;
      views: string;
      content: string;
      rating: string;
    };
    content: {
      recent: {
        title: string;
        viewAll: string;
      };
      views: string;
      hide: string;
      show: string;
      edit: string;
      premium: string;
      free: string;
    };
  };
  admin: {
    dashboard: {
      title: string;
      welcome: string;
    };
    requests: {
      title: string;
      approve: string;
      reject: string;
      expand: string;
      collapse: string;
    };
    users: {
      title: string;
      filter: {
        type: string;
        status: string;
        search: string;
        active: string;
        blocked: string;
      };
      types: {
        estandar: string;
        premium: string;
        creador: string;
        administrador: string;
      };
      block: string;
      unblock: string;
      cancel: string;
      edit: string;
      save: string;
    };
  };
  cookies: {
    notice: {
      title: string;
      description: string;
      legal: string;
      autoAccept: string;
    };
    buttons: {
      accept: string;
      reject: string;
      cookiePolicy: string;
    };
    page: {
      locale: string;
      title: string;
      subtitle: string;
      lastUpdated: string;
      whatAre: {
        title: string;
        description: string;
        purpose: string;
      };
      weUse: {
        title: string;
        description: string;
      };
      categories: {
        essential: {
          title: string;
          description: string;
        };
        analytics: {
          title: string;
          description: string;
        };
      };
      legal: {
        title: string;
        gdpr: string;
        lssi: string;
        lopd: string;
      };
      rights: {
        title: string;
        description: string;
        access: {
          title: string;
          description: string;
        };
        rectification: {
          title: string;
          description: string;
        };
        erasure: {
          title: string;
          description: string;
        };
        objection: {
          title: string;
          description: string;
        };
      };
      manage: {
        title: string;
        description: string;
        browsers: {
          title: string;
          chrome: string;
          firefox: string;
          safari: string;
          edge: string;
        };
      };
      contact: {
        title: string;
        description: string;
        email: string;
        company: string;
        authority: string;
        aepd: string;
      };
      table: {
        name: string;
        purpose: string;
        duration: string;
        type: string;
        typeOwn: string;
      };
      essential: {
        language: {
          purpose: string;
          duration: string;
        };
        consent: {
          purpose: string;
          duration: string;
        };
      };
      analytics: {
        ga: {
          purpose: string;
          duration: string;
        };
        gaId: {
          purpose: string;
          duration: string;
        };
      };
      backToHome: string;
    };
  };
  profile: {
    avatar: {
      alt: string;
    };
    photo: {
      placeholder: string;
    };
    actions: {
      editProfileInfo: string;
    };
    status: {
      active: string;
      inactive: string;
    };
    cards: {
      profile: {
        title: string;
        fields: {
          email: string;
          firstName: string;
          lastName: string;
          alias: string;
          birthDate: string;
          memberSince: string;
          status: string;
        };
      };
      subscription: {
        title: string;
        currentPlan: string;
        subscribedSince: string;
        updateSubscription: string;
      };
      security: {
        title: string;
        changePassword: string;
        changePasswordButton: string;
        startChangePasswordProcess: string;
        changePasswordDescription: string;
        currentPassword: string;
        newPassword: string;
        confirmPassword: string;
        passwordStrength: {
          veryWeak: string;
          weak: string;
          fair: string;
          good: string;
          strong: string;
        };
        twoFactor: {
          title: string;
          description: string;
          enable: string;
        };
        threeFactor: {
          title: string;
          description: string;
          enable: string;
        };
      };
      cancellation: {
        title: string;
        description: string;
        warning: string;
        deleteAccount: string;
        confirmDeleteTitle: string;
        confirmDeleteMessage: string;
        confirmDeleteDescription: string;
        consequence1: string;
        consequence2: string;
        consequence3: string;
        consequence4: string;
        finalWarning: string;
        keepAccount: string;
        confirmDelete: string;
        passwordRequiredTitle: string;
        passwordRequiredMessage: string;
        enterPassword: string;
        passwordPlaceholder: string;
        deleteAccountPermanently: string;
        deleting: string;
      };
    };
  };
  playlist: {
    title: string;
    subtitle: string;
    createNew: string;
    loading: string;
    loadingDetail: string;
    empty: {
      title: string;
      subtitle: string;
    };
    lastUpdate: string;
    item: string;
    items: string;
    timeAgo: {
      today: string;
      yesterday: string;
      daysAgo: string;
      weeksAgo: string;
      monthsAgo: string;
    };
    notFound: {
      title: string;
      subtitle: string;
    };
    myLists: string;
    visibility: {
      private: string;
      restricted: string;
      unlisted: string;
      public: string;
    };
    playList: string;
    edit: string;
    delete: string;
    content: string;
    add: string;
    emptyList: {
      title: string;
      subtitle: string;
    };
    success: {
      updated: string;
      deleted: string;
      removed: string;
    };
    error: {
      load: string;
      update: string;
      delete: string;
      remove: string;
    };
    confirmDelete: string;
    contentTypes: {
      video: string;
      audio: string;
      content: string;
    };
  };
  profilePage: {
    loading: string;
    error: string;
  };
  creatorPage: {
    loading: string;
  };
  adminPage: {
    loading: string;
  };
  addContentPage: {
    loading: string;
    listNotFound: string;
    backToMyLists: string;
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    allGenres: string;
    genres: {
      music: string;
      action: string;
      comedy: string;
      drama: string;
      documentary: string;
    };
    sortBy: {
      recent: string;
      mostViewed: string;
      bestRated: string;
    };
    noContentFound: string;
    contentTypes: {
      video: string;
      audio: string;
      content: string;
    };
    selection: {
      item: string;
      items: string;
      selected: string;
      selectedPlural: string;
    };
    addToList: string;
    errors: {
      loadContent: string;
      addToList: string;
    };
    success: {
      addedToList: string;
    };
  };
  errors: {
    403: {
      title: string;
      subtitle: string;
      message: string;
      goHome: string;
      goBack: string;
    };
    401: {
      title: string;
      message: string;
      loginButton: string;
      homeButton: string;
    };
    404: {
      title: string;
      subtitle: string;
      message: string;
      goHome: string;
      goBack: string;
    };
  };
  403: {
    title: string;
    subtitle: string;
    message: string;
    goHome: string;
    goBack: string;
  };
  401: {
    title: string;
    message: string;
    loginButton: string;
    homeButton: string;
  };
  404: {
    title: string;
    subtitle: string;
    message: string;
    goHome: string;
    goBack: string;
  };
}