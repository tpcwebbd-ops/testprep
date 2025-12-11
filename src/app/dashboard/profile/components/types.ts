export interface UserFormData {
  name: string;
  email: string;
  emailVerified: boolean;
}

export interface ProfileFormData {
  phone: string;
  bio: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  dateOfBirth: string;
  gender: string;
  occupation: string;
  website: string;
  socialLinks: {
    facebook: string;
    twitter: string;
    linkedin: string;
    github: string;
    instagram: string;
  };
  preferences: {
    newsletter: boolean;
    notifications: boolean;
    theme: string;
  };
}
