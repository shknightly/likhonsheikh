import { Button, Card, Grid, Spacer, Text, useTheme } from '@geist-ui/core';
import { ArrowRight } from '@geist-ui/icons';
import Head from 'next/head';
import type { GetStaticProps, NextPage } from 'next';

import Footer from '@/components/Footer';
import { PlatformMetrics } from '@/types/platform';
import { getLaunchMetrics } from '@/utils/metrics';
import { getClientEnv } from '@/utils/env';

interface HomePageProps {
  stackProjectId: string;
}

const HomePage: NextPage<HomePageProps> = ({ stackProjectId }) => {
  const theme = useTheme();
  const launchMetrics: PlatformMetrics = getLaunchMetrics();

  return (
    <>
      <Head>
        <title>likhonsheikh — বাংলা-প্রথম ব্লগিং প্ল্যাটফর্ম</title>
      </Head>
      <main style={{ backgroundColor: theme.palette.background, minHeight: '100vh' }}>
        <section className="px-6 md:px-18 py-16 md:py-24">
          <Grid.Container gap={2} alignItems="center">
            <Grid xs={24} md={14}>
              <div>
                <Text h1 className="section-title" aria-level={1} role="heading">
                  স্বতন্ত্র বাংলা কনটেন্টের নতুন ঘর
                </Text>
                <Spacer h={1} />
                <Text p className="section-subtitle">
                  ইমেইল পাবলিশিং, সাবস্ক্রিপশন মডেল, আর বাংলা পাঠকদের জন্য পারফেক্ট রিডিং এক্সপেরিয়েন্স—সবকিছুর সমন্বয়ে likhonsheikh.com তৈরি। লেখক ও পাঠক উভয়ের জন্য টেকসই আয় নিশ্চিত করার লক্ষ্যে আমরা লঞ্চ করছি।
                </Text>
                <Spacer h={0.75} />
                <Text small type="secondary" aria-label="স্ট্যাক কনফিগারেশন">
                  Stack প্রজেক্ট আইডি: {stackProjectId}
                </Text>
                <Spacer h={1.5} />
                <Grid.Container gap={1} role="group" aria-label="প্রাথমিক কল টু অ্যাকশন">
                  <Grid>
                    <Button
                      aria-label="অভিজ্ঞতা দেখুন"
                      auto
                      type="success"
                      scale={1.2}
                      iconRight={<ArrowRight />}
                    >
                      ডেমো পোস্ট পড়ুন
                    </Button>
                  </Grid>
                  <Grid>
                    <Button auto type="secondary" ghost>
                      ইমেইল সাবস্ক্রিপশন দেখুন
                    </Button>
                  </Grid>
                </Grid.Container>
              </div>
            </Grid>
            <Grid xs={24} md={10}>
              <Card shadow style={{ borderRadius: '1.5rem' }} role="presentation">
                <Text h3 className="section-title" style={{ fontSize: '1.75rem' }}>
                  কেন likhonsheikh আলাদা
                </Text>
                <Spacer h={1} />
                <ul className="list-disc list-inside space-y-2 text-neutral/90">
                  <li>
                    <strong>ইমেইল প্রকাশ:</strong> লেখকরা সরাসরি ইনবক্সে পোস্ট পাঠাতে পারবেন, ওপেন রেট রিপোর্ট সহ।
                  </li>
                  <li>
                    <strong>দ্বিভাষিক UI:</strong> বাংলা ও ইংরেজি সমর্থন, বাংলা পাঠকদের জন্য স্বচ্ছন্দ ফন্ট সেটিংস।
                  </li>
                  <li>
                    <strong>রেসপনসিভ ডিজাইন:</strong> মোবাইল ফার্স্ট অভিজ্ঞতা নিশ্চিত করতে Lighthouse স্কোর ≥ 95 লক্ষ্য।
                  </li>
                </ul>
              </Card>
            </Grid>
          </Grid.Container>
        </section>

        <section className="bg-white px-6 md:px-18 py-16" aria-labelledby="metrics-heading">
          <Text id="metrics-heading" h2 className="section-title">
            লঞ্চ প্রস্তুতির অগ্রগতি
          </Text>
          <Spacer h={1.5} />
          <Grid.Container gap={2} justify="space-between">
            {launchMetrics.highlights.map((item) => (
              <Grid xs={24} md={8} key={item.title}>
                <Card shadow hoverable style={{ borderRadius: '1rem', width: '100%' }}>
                  <Text h3 style={{ fontFamily: 'var(--font-noto-sans-bengali)', fontSize: '1.5rem' }}>
                    {item.title}
                  </Text>
                  <Text p className="section-subtitle" style={{ marginBottom: '0.75rem' }}>
                    {item.description}
                  </Text>
                  <Text span b style={{ fontSize: '1.25rem' }}>
                    {item.metric}
                  </Text>
                </Card>
              </Grid>
            ))}
          </Grid.Container>
        </section>

        <section className="px-6 md:px-18 py-16 bg-[#eef4f8]" aria-labelledby="features-heading">
          <Text id="features-heading" h2 className="section-title">
            লেখক ও পাঠকের মূল সুবিধা
          </Text>
          <Spacer h={1.5} />
          <Grid.Container gap={2}>
            <Grid xs={24} md={12}>
              <Card shadow width="100%" style={{ borderRadius: '1rem' }}>
                <Text h3 className="section-title" style={{ fontSize: '1.75rem' }}>
                  লেখকদের জন্য
                </Text>
                <Spacer h={0.75} />
                <ul className="list-disc list-inside space-y-2 text-neutral/90">
                  <li>
                    <strong>ইমেইল শিডিউলার:</strong> নির্দিষ্ট তারিখ ও টাইমজোন অনুযায়ী পাঠানো যায়।
                  </li>
                  <li>
                    <strong>মনিটাইজেশন কন্ট্রোল:</strong> পেইড/ফ্রি সেগমেন্ট নির্ধারণ ও কুপন সাপোর্ট।
                  </li>
                </ul>
              </Card>
            </Grid>
            <Grid xs={24} md={12}>
              <Card shadow width="100%" style={{ borderRadius: '1rem' }}>
                <Text h3 className="section-title" style={{ fontSize: '1.75rem' }}>
                  পাঠকদের জন্য
                </Text>
                <Spacer h={0.75} />
                <ul className="list-disc list-inside space-y-2 text-neutral/90">
                  <li>
                    <strong>রিডিং প্রগ্রেস:</strong> স্ক্রোল অবস্থার উপর ভিত্তি করে প্রগ্রেস বার আপডেট।
                  </li>
                  <li>
                    <strong>বুকমার্কিং:</strong> অফলাইন রিডিং কিউয়ের সাথে সিঙ্ক হওয়া সংগ্রহ।
                  </li>
                </ul>
              </Card>
            </Grid>
          </Grid.Container>
        </section>
      </main>
      <Footer />
    </>
  );
};

export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
  const { NEXT_PUBLIC_STACK_PROJECT_ID } = getClientEnv();

  return {
    props: {
      stackProjectId: NEXT_PUBLIC_STACK_PROJECT_ID
    },
    revalidate: 60
  };
};

export default HomePage;
