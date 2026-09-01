declare global {
  namespace App {
    interface Locals {
      user: { login: string; name: string; role: string } | null;
    }
  }
}

export {};
