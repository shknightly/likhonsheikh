import { PlatformMetrics } from '@/types/platform';

export const getLaunchMetrics = (): PlatformMetrics => ({
  highlights: [
    {
      title: 'মোবাইল লোড টাইম',
      description: '৪জি সংযোগে প্রাথমিক LCP টেস্ট গড়ে ২.১ সেকেন্ডে সীমাবদ্ধ রাখা হয়েছে।',
      metric: '২.১ সেকেন্ড'
    },
    {
      title: 'ইমেইল সাবস্ক্রাইবার আগ্রহ',
      description: 'বেটা লিস্টে ৫০০+ লেখক ও পাঠক যোগ দিয়েছেন, প্রতিদিন বৃদ্ধি পাচ্ছে।',
      metric: '৫০০+ প্রি-সাইনআপ'
    },
    {
      title: 'অ্যাক্সেসিবিলিটি স্কোর',
      description: 'WCAG 2.1 AA মান পরীক্ষায় Lighthouse স্কোর ১০০ বজায় রাখা হচ্ছে।',
      metric: 'স্কোর ১০০/১০০'
    }
  ]
});
