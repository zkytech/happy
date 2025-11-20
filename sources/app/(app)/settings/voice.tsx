import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Item } from '@/components/Item';
import { ItemGroup } from '@/components/ItemGroup';
import { ItemList } from '@/components/ItemList';
import { useSettingMutable } from '@/sync/storage';
import { settingsDefaults } from '@/sync/settings';
import { useUnistyles } from 'react-native-unistyles';
import { findLanguageByCode, getLanguageDisplayName, LANGUAGES } from '@/constants/Languages';
import { t } from '@/text';
import { Modal } from '@/modal';

export default function VoiceSettingsScreen() {
    const { theme } = useUnistyles();
    const router = useRouter();
    const [voiceAssistantLanguage] = useSettingMutable('voiceAssistantLanguage');
    const [voiceAssistantAgentId, setVoiceAssistantAgentId] = useSettingMutable('voiceAssistantAgentId');
    
    // Find current language or default to first option
    const currentLanguage = findLanguageByCode(voiceAssistantLanguage) || LANGUAGES[0];
    const effectiveAgentId = voiceAssistantAgentId || settingsDefaults.voiceAssistantAgentId;

    const handleEditAgentId = async () => {
        const current = voiceAssistantAgentId ?? settingsDefaults.voiceAssistantAgentId;
        const result = await Modal.prompt(
            t('settingsVoice.agentIdTitle'),
            undefined,
            {
                placeholder: t('settingsVoice.agentIdPlaceholder'),
                defaultValue: current,
                cancelText: t('common.cancel'),
                confirmText: t('common.save'),
            }
        );

        if (result !== null) {
            const trimmed = result.trim();
            setVoiceAssistantAgentId(trimmed || settingsDefaults.voiceAssistantAgentId);
        }
    };
    
    return (
        <ItemList style={{ paddingTop: 0 }}>
            {/* Language Settings */}
            <ItemGroup 
                title={t('settingsVoice.languageTitle')}
                footer={t('settingsVoice.languageDescription')}
            >
                <Item
                    title={t('settingsVoice.preferredLanguage')}
                    subtitle={t('settingsVoice.preferredLanguageSubtitle')}
                    icon={<Ionicons name="language-outline" size={29} color="#007AFF" />}
                    detail={getLanguageDisplayName(currentLanguage)}
                    onPress={() => router.push('/settings/voice/language')}
                />
            </ItemGroup>

            {/* Agent ID Settings */}
            <ItemGroup>
                <Item
                    title={t('settingsVoice.agentIdTitle')}
                    icon={<Ionicons name="settings-outline" size={29} color="#34C759" />}
                    detail={effectiveAgentId}
                    onPress={handleEditAgentId}
                />
            </ItemGroup>

        </ItemList>
    );
}
