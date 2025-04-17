'use client';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { useGetProfileMutation, useSignInMutation } from '@/store/queries/auth';
import webStorageClient from '@/utils/webStorageClient';

const formSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address' }),
  password: z
    .string()
    .min(1, { message: 'Password must be at least 6 characters' })
});

type UserFormValue = z.infer<typeof formSchema>;

export default function UserAuthForm() {
  const router = useRouter();
  const [signIn, { isLoading }] = useSignInMutation();
  const [getInfo] = useGetProfileMutation();
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const handleSignIn = async (data: UserFormValue) => {
    try {
      // Gửi yêu cầu đăng nhập và lấy token
      const response = await signIn(data).unwrap();
      const token = response.data.token;
  
      // Lưu token vào localStorage hoặc webStorageClient
      const temp = webStorageClient.setToken(token);
  ;
      // Gọi API lấy thông tin người dùng (sử dụng token đã lưu)
      await getInfo(token);
  
      // Lấy lại thông tin người dùng đã được lưu
      const info = webStorageClient.getUserInfo();
    
      const infoJson = info ? JSON.parse(info) : null;
     
      // Kiểm tra vai trò
      if (infoJson?.role === 'ADMIN') {
        toast.success('Signed In Successfully!');
        router.push('/dashboard');
      } else {
        toast.error('Unauthorized Access');
      }
    } catch (error: any) {
      toast.error('Sign In Failed!');
    }
  };
  
  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSignIn)}
          className="w-full space-y-2"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="ml-auto w-full" type="submit">
            Continue With Email
          </Button>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
    </>
  );
}
