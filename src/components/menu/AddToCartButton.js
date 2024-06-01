import { useTranslations } from 'next-intl';

export default function AddToCartButton({
  hasSizesOrExtras, onClick, basePrice, image
}) 
{
  const t = useTranslations('components.menu.AddToCartButton');
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-4 bg-primary text-white rounded-full px-8 py-2"
    >
      <span>{t('add')} ({t('from')} ${basePrice})</span>
    </button>
  );
}