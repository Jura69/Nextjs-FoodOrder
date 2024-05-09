import Right from "@/components/icons/Right";
import Image from "next/image";
import { useTranslations } from 'next-intl';

export default function Hero() {
  const t = useTranslations('components');
  return (
    <section className="hero md:mt-4">
      <div className="py-8 md:py-12">
        <h1 className="text-4xl font-semibold">
          Everything
          <br />
          is better
          <br />
          with&nbsp;
          <span className="text-primary">Food</span>
        </h1>
        <p className="my-6 text-gray-500 text-sm">
          {t('layout.Hero.discover')}
        </p>
        <div className="flex gap-4 text-sm">
          <button className="justify-center uppercase items-center bg-primary gap-2 text-white px-4 py-2 rounded-full">
            <a href="/menu">{t('layout.Hero.order_now')}</a>
            <Right />
          </button>

          <button className="flex items-center border-0 gap-2 py-2 text-gray-600 font-semibold">
            <a href="#about">
            {t('layout.Hero.learn_more')}
            </a>
            <Right />
          </button>
        </div>
      </div>
      <div className="relative hidden md:block">
        <Image
          src={"/banhxeo.png"}
          layout={"fill"}
          objectFit={"contain"}
          alt={"pizza"}
        />
      </div>
    </section>
  );
}

