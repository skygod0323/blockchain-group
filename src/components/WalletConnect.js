import { useLocalizationContext } from "../context/LocalizationContext";

const WalletConnect = () => {
    const {t} = useLocalizationContext();
    return (
        <>{t('You should connect wallet to use this system.')}</>
    )
}

export default WalletConnect;