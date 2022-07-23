import { useLocalizationContext } from "../../../context/LocalizationContext";

const PageNotFound = () => {
    const {t} = useLocalizationContext()
    return (
        <>{t('Page Not Found')}</>
    )
}

export default PageNotFound;