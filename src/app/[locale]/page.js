import Header from "@/components/layout/Header";
import Hero from "@/components/layout/Hero";
import HomeMenu from "@/components/layout/HomeMenu";
import SectionHeaders from "@/components/layout/SectionHeaders";
import { useTranslations } from "next-intl";
export default function Home() {
  const t = useTranslations("default");
  return (
    <>
      <Hero />
      <HomeMenu />
      <section className="text-center my-16" id="about">
        <SectionHeaders subHeader={t("our_story")} mainHeader={t("about_us")} />
        <div className="text-gray-500 max-w-2xl mx-auto mt-4 flex flex-col gap-4 text-justify">
          <p>
            {t("p1")},{" "} 
            <a className="text-primary">FOOD LOVER</a>{" "} 
            {t('p2')},{" "}
            <a className="text-primary">FOOD LOVER</a>{" "} 
            {t('p3')}{" "}
          </p>
          <p>
            {t('p4')}{" "}
            <a className="text-primary ">FOOD LOVER</a>{" "}
            {t('p5')}{" "}
            <a className="text-primary">FOOD LOVER</a>,{" "}
            {t('p6')}{" "}
          </p>
        </div>
      </section>
      <section className="text-center my-8" id="contact">
        <SectionHeaders
          subHeader={t('dont')}
          mainHeader={t('contact')}
        />
        <div className="mt-8">
          <a className="text-4xl text-gray-500" href="tel:0967089107">
            0967089107
          </a>
        </div>
      </section>
    </>
  );
}
