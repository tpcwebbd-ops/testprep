'use server';

import { revalidatePath } from 'next/cache';

export async function refreshMenu() {
  revalidatePath('/', 'layout');
  return { success: true, message: 'Menu updated successfully' };
}
