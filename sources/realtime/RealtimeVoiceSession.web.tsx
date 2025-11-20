import React, { useEffect, useRef } from 'react';
import { useConversation } from '@elevenlabs/react';
import { registerVoiceSession } from './RealtimeSession';
import { storage } from '@/sync/storage';
import { settingsDefaults } from '@/sync/settings';
import { realtimeClientTools } from './realtimeClientTools';
import { getElevenLabsCodeFromPreference } from '@/constants/Languages';
import type { VoiceSession, VoiceSessionConfig } from './types';

// Static reference to the conversation hook instance
let conversationInstance: ReturnType<typeof useConversation> | null = null;

// Global voice session implementation
class RealtimeVoiceSessionImpl implements VoiceSession {

    async startSession(config: VoiceSessionConfig): Promise<void> {
        if (!conversationInstance) {
            console.warn('Realtime voice session not initialized');
            return;
        }

        try {
            storage.getState().setRealtimeStatus('connecting');

            // Request microphone permission first
            try {
                await navigator.mediaDevices.getUserMedia({ audio: true });
            } catch (error) {
                console.error('Failed to get microphone permission:', error);
                storage.getState().setRealtimeStatus('error');
                return;
            }


            // Read current settings
            const settings = storage.getState().settings;

            // Get user's preferred language for voice assistant
            const userLanguagePreference = settings.voiceAssistantLanguage;
            const elevenLabsLanguage = getElevenLabsCodeFromPreference(userLanguagePreference);

            // Resolve agent ID from settings, falling back to default production agent
            const agentId = settings.voiceAssistantAgentId || settingsDefaults.voiceAssistantAgentId;

            if (!agentId) {
                console.warn('No ElevenLabs agent ID configured for voice assistant');
                storage.getState().setRealtimeStatus('error');
                return;
            }

            const conversationId = await conversationInstance.startSession({
                agentId,
                connectionType: 'webrtc', // Use WebRTC for better performance
                // Pass session ID and initial context as dynamic variables
                dynamicVariables: {
                    sessionId: config.sessionId,
                    initialConversationContext: config.initialContext || ''
                },
                overrides: {
                    agent: {
                        language: elevenLabsLanguage
                    }
                }
            });

            console.log('Started conversation with ID:', conversationId);
        } catch (error) {
            console.error('Failed to start realtime session:', error);
            storage.getState().setRealtimeStatus('error');
        }
    }

    async endSession(): Promise<void> {
        if (!conversationInstance) {
            return;
        }

        try {
            await conversationInstance.endSession();
            storage.getState().setRealtimeStatus('disconnected');
        } catch (error) {
            console.error('Failed to end realtime session:', error);
        }
    }

    sendTextMessage(message: string): void {
        if (!conversationInstance) {
            console.warn('Realtime voice session not initialized');
            return;
        }

        conversationInstance.sendUserMessage(message);
    }

    sendContextualUpdate(update: string): void {
        if (!conversationInstance) {
            console.warn('Realtime voice session not initialized');
            return;
        }

        conversationInstance.sendContextualUpdate(update);
    }
}

export const RealtimeVoiceSession: React.FC = () => {
    const conversation = useConversation({
        clientTools: realtimeClientTools,
        onConnect: () => {
            // console.log('Realtime session connected');
            storage.getState().setRealtimeStatus('connected');
        },
        onDisconnect: () => {
            // console.log('Realtime session disconnected');
            storage.getState().setRealtimeStatus('disconnected');
        },
        onMessage: (data) => {
            // console.log('Realtime message:', data);
        },
        onError: (error) => {
            // console.error('Realtime error:', error);
            storage.getState().setRealtimeStatus('error');
        },
        onStatusChange: (data) => {
            // console.log('Realtime status change:', data);
        },
        onModeChange: (data) => {
            // console.log('Realtime mode change:', data);
        },
        onDebug: (message) => {
            // console.debug('Realtime debug:', message);
        }
    });

    const hasRegistered = useRef(false);

    useEffect(() => {
        // Store the conversation instance globally
        conversationInstance = conversation;

        // Register the voice session once
        if (!hasRegistered.current) {
            try {
                registerVoiceSession(new RealtimeVoiceSessionImpl());
                hasRegistered.current = true;
            } catch (error) {
                console.error('Failed to register voice session:', error);
            }
        }

        return () => {
            // Clean up on unmount
            conversationInstance = null;
        };
    }, [conversation]);

    // This component doesn't render anything visible
    return null;
};
