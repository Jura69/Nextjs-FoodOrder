import FlyingButton from 'react-flying-item'
import { useTranslations } from 'next-intl';

export default function AddToCartButton({
  hasSizesOrExtras, onClick, basePrice, image
}) 
{
  const t = useTranslations('components.menu.AddToCartButton');

  if (!hasSizesOrExtras) {
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