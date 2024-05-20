import { useRouter, usePathname } from "../../navigation";
import { useEffect, useState } from 'react';

export default function LanguageChanger({ locale }) {
    const router = useRouter();
    const pathname = usePathname();
    const storedLocale = localStorage.getItem('locale');
    const [selectedLocale, setSelectedLocale] = useState(storedLocale || locale);

    useEffect(() => {
        localStorage.setItem('locale', selectedLocale);
    }, [selectedLocale]);

    const handleChange = (e) => {
        setSelectedLocale(e.target.value);
        router.push(pathname, { locale: e.target.value });
    };

    return (
        <select value={selectedLocale} onChange={handleChange}>
            <option value="en">English</option>
            <option value="vi">Tiếng Việt</option>
        </select>
    );
}