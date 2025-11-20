import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Item } from '@/components/Item';
import { ItemGroup } from '@/components/ItemGroup';
import { ItemList } from '@/components/ItemList';
import { useSettingMutable } from '@/sync/storage';
import { useUnistyles } from 'react-native-unistyles';
import { PermissionMode, ModelMode } from '@/components/PermissionModeSelector';
import { t } from '@/text';

// Helper type guards to keep settings values within supported ranges
const CLAUDE_PERMISSION_MODES: PermissionMode[] = ['default', 'acceptEdits', 'plan', 'bypassPermissions'];
const CODEX_PERMISSION_MODES: PermissionMode[] = ['default', 'read-only', 'safe-yolo', 'yolo'];

const CLAUDE_MODEL_MODES: ModelMode[] = ['default', 'adaptiveUsage', 'sonnet', 'opus'];
const CODEX_MODEL_MODES: ModelMode[] = [
    'gpt-5-codex-high',
    'gpt-5-codex-medium',
    'gpt-5-codex-low',
    'default',
    'gpt-5-minimal',
    'gpt-5-low',
    'gpt-5-medium',
    'gpt-5-high',
];

function isClaudePermissionMode(value: unknown): value is PermissionMode {
    return typeof value === 'string' && (CLAUDE_PERMISSION_MODES as string[]).includes(value);
}

function isCodexPermissionMode(value: unknown): value is PermissionMode {
    return typeof value === 'string' && (CODEX_PERMISSION_MODES as string[]).includes(value);
}

function isClaudeModelMode(value: unknown): value is ModelMode {
    return typeof value === 'string' && (CLAUDE_MODEL_MODES as string[]).includes(value);
}

function isCodexModelMode(value: unknown): value is ModelMode {
    return typeof value === 'string' && (CODEX_MODEL_MODES as string[]).includes(value);
}

export default function AgentDefaultsSettingsScreen() {
    const { theme } = useUnistyles();

    const [claudePermissionRaw, setClaudePermission] = useSettingMutable('claudeDefaultPermissionMode');
    const [claudeModelRaw, setClaudeModel] = useSettingMutable('claudeDefaultModelMode');
    const [codexPermissionRaw, setCodexPermission] = useSettingMutable('codexDefaultPermissionMode');
    const [codexModelRaw, setCodexModel] = useSettingMutable('codexDefaultModelMode');

    const claudePermission: PermissionMode =
        isClaudePermissionMode(claudePermissionRaw) ? claudePermissionRaw as PermissionMode : 'default';
    const claudeModel: ModelMode =
        isClaudeModelMode(claudeModelRaw) ? claudeModelRaw as ModelMode : 'default';

    const codexPermission: PermissionMode =
        isCodexPermissionMode(codexPermissionRaw) ? codexPermissionRaw as PermissionMode : 'default';
    const codexModel: ModelMode =
        isCodexModelMode(codexModelRaw) ? codexModelRaw as ModelMode : 'gpt-5-codex-high';

    const renderCheck = (active: boolean) =>
        active ? <Ionicons name="checkmark" size={20} color={theme.colors.text} /> : null;

    return (
        <ItemList style={{ paddingTop: 0 }}>
            {/* Claude Code defaults */}
            <ItemGroup
                title={t('agentInput.agent.claude')}
            >
                {/* Permission mode */}
                {CLAUDE_PERMISSION_MODES.map((mode) => (
                    <Item
                        key={`claude-permission-${mode}`}
                        title={
                            mode === 'default' ? t('agentInput.permissionMode.default') :
                                mode === 'acceptEdits' ? t('agentInput.permissionMode.acceptEdits') :
                                    mode === 'plan' ? t('agentInput.permissionMode.plan') :
                                        t('agentInput.permissionMode.bypassPermissions')
                        }
                        subtitle={t('agentInput.permissionMode.title')}
                        icon={<Ionicons name="shield-checkmark-outline" size={24} color="#007AFF" />}
                        rightElement={renderCheck(claudePermission === mode)}
                        onPress={() => setClaudePermission(mode)}
                        showChevron={false}
                    />
                ))}
                {/* Model */}
                {CLAUDE_MODEL_MODES.map((mode) => (
                    <Item
                        key={`claude-model-${mode}`}
                        title={
                            mode === 'default' ? t('agentInput.model.default') :
                                mode === 'adaptiveUsage' ? t('agentInput.model.adaptiveUsage') :
                                    mode === 'sonnet' ? t('agentInput.model.sonnet') :
                                        t('agentInput.model.opus')
                        }
                        subtitle={t('agentInput.model.title')}
                        icon={<Ionicons name="speedometer-outline" size={24} color="#5856D6" />}
                        rightElement={renderCheck(claudeModel === mode)}
                        onPress={() => setClaudeModel(mode)}
                        showChevron={false}
                    />
                ))}
            </ItemGroup>

            {/* Codex defaults */}
            <ItemGroup
                title={t('agentInput.agent.codex')}
            >
                {/* Permission mode */}
                {CODEX_PERMISSION_MODES.map((mode) => (
                    <Item
                        key={`codex-permission-${mode}`}
                        title={
                            mode === 'default' ? t('agentInput.codexPermissionMode.default') :
                                mode === 'read-only' ? t('agentInput.codexPermissionMode.readOnly') :
                                    mode === 'safe-yolo' ? t('agentInput.codexPermissionMode.safeYolo') :
                                        t('agentInput.codexPermissionMode.yolo')
                        }
                        subtitle={t('agentInput.codexPermissionMode.title')}
                        icon={<Ionicons name="shield-outline" size={24} color="#34C759" />}
                        rightElement={renderCheck(codexPermission === mode)}
                        onPress={() => setCodexPermission(mode)}
                        showChevron={false}
                    />
                ))}
                {/* Model */}
                {CODEX_MODEL_MODES.map((mode) => (
                    <Item
                        key={`codex-model-${mode}`}
                        title={
                            mode === 'gpt-5-codex-high' ? t('agentInput.codexModel.gpt5CodexHigh') :
                                mode === 'gpt-5-codex-medium' ? t('agentInput.codexModel.gpt5CodexMedium') :
                                    mode === 'gpt-5-codex-low' ? t('agentInput.codexModel.gpt5CodexLow') :
                                        mode === 'default' ? t('agentInput.model.default') :
                                            mode === 'gpt-5-minimal' ? t('agentInput.codexModel.gpt5Minimal') :
                                                mode === 'gpt-5-low' ? t('agentInput.codexModel.gpt5Low') :
                                                    mode === 'gpt-5-medium' ? t('agentInput.codexModel.gpt5Medium') :
                                                        t('agentInput.codexModel.gpt5High')
                        }
                        subtitle={t('agentInput.codexModel.title')}
                        icon={<Ionicons name="flash-outline" size={24} color="#FF9500" />}
                        rightElement={renderCheck(codexModel === mode)}
                        onPress={() => setCodexModel(mode)}
                        showChevron={false}
                    />
                ))}
            </ItemGroup>
        </ItemList>
    );
}

