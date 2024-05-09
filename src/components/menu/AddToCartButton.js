import FlyingButton from 'react-flying-item'
import { useTranslations } from 'next-intl';

export default function AddToCartButton({
  hasSizesOrExtras, onClick, basePrice, image
}) 
{
  if (!hasSizesOrExtras) {
  const t = useTranslations('components.menu.AddToCartButton');

    return (
      <div className="flying-button-parent mt-4">
        <FlyingButton
          targetTop={'5%'}
          targetLeft={'95%'}
          src={image}>
          <div onClick={onClick}>
            {t('add')} ${basePrice}
          </div>
        </FlyingButton>
      </div>
    );
  }
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