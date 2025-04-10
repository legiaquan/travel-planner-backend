import * as bcrypt from 'bcryptjs';

export const hashPassword = async (password: string): Promise<string> => {
  if (!password) {
    throw new Error('Password is required');
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    console.log('Hashed password:', hash);
    return hash;
  } catch (error) {
    throw new Error(`Failed to hash password: ${error.message}`);
  }
};

export const comparePassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  if (!password || !hashedPassword) {
    throw new Error('Password and hashed password are required');
  }
  try {
    console.log('Comparing password:', password);
    console.log('With hashed password:', hashedPassword);
    const result = await bcrypt.compare(password, hashedPassword);
    console.log('Compare result:', result);
    return result;
  } catch (error) {
    throw new Error(`Failed to compare passwords: ${error.message}`);
  }
};
