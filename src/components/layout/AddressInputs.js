import { useTranslations } from 'next-intl';
import { useState } from 'react';

export default function AddressInputs({ addressProps, setAddressProp, disabled = false }) {
  const t = useTranslations('components.layout.AddressInputs');
  const { phone, streetAddress, postalCode, city, country } = addressProps;
  const [isChar, setIsChar] = useState(false);
  return (
    <>
      <label>{t('phone')}</label>
      <input
        disabled={disabled}
        type="tel"
        placeholder="Phone number"
        value={phone || ''}
        onChange={ev => {
          const value = ev.target.value;
          const pureNumbers = value.replace('+', '');
          if (value === '' || (pureNumbers.length <= 11 && /^(\+)?[0-9]*$/.test(value))) {
            setAddressProp('phone', value);
            setIsChar(false);
          } else {
            setIsChar(true);
          }
        }}
      />
      {isChar &&
          <p className="text-red-500">Invalid Phone Number.</p>}


      <label>{t('street_address')}</label>
      <input
        disabled={disabled}
        type="text" placeholder="Street address"
        value={streetAddress || ''} onChange={ev => setAddressProp('streetAddress', ev.target.value)}
      />
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label>{t('postal_code')}</label>
          <input
            disabled={disabled}
            type="text" placeholder="Postal code"
            value={postalCode || ''} onChange={ev => setAddressProp('postalCode', ev.target.value)}
          />
        </div>
        <div>
          <label>{t('city')}</label>
          <input
            disabled={disabled}
            type="text" placeholder="City"
            value={city || ''} onChange={ev => setAddressProp('city', ev.target.value)}
          />
        </div>
      </div>
      <label>{t('country')}</label>
      <input
        disabled={disabled}
        type="text" placeholder="Country"
        value={country || ''} onChange={ev => setAddressProp('country', ev.target.value)}
      />
    </>
  );
}