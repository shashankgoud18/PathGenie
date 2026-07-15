import { z } from 'zod';

const createOrderSchema = z.object({
  userEmail: z.string({ required_error: 'User email is required' }).email('Invalid user email address'),
  userName: z.string().optional(),
  amount: z.number().optional().default(7900)
});

const verifySignatureSchema = z.object({
  razorpay_order_id: z.string({ required_error: 'razorpay_order_id is required' }).trim().min(1),
  razorpay_payment_id: z.string({ required_error: 'razorpay_payment_id is required' }).trim().min(1),
  razorpay_signature: z.string({ required_error: 'razorpay_signature is required' }).trim().min(1)
});

export const validateCreateOrder = (req, res, next) => {
  const result = createOrderSchema.safeParse(req.body);
  if (!result.success) {
    const errorMsg = result.error.errors.map(e => e.message).join(', ');
    return res.status(400).json({ error: errorMsg });
  }
  req.validatedBody = result.data;
  next();
};

export const validateVerifySignature = (req, res, next) => {
  const result = verifySignatureSchema.safeParse(req.body);
  if (!result.success) {
    const errorMsg = result.error.errors.map(e => e.message).join(', ');
    return res.status(400).json({ error: errorMsg });
  }
  req.validatedBody = result.data;
  next();
};
