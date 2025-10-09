// Remplacement: console.info → log.info
// Remplacement: console.warn → log.warn
// Remplacement: console.error → log.error
/**
 * Système de logging sécurisé pour Analysticks
 * Remplace les console.log par un système de logging approprié
 */

const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
};

class SecureLogger {
  constructor() {
    this.level = this.getLogLevel();
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.isProduction = process.env.NODE_ENV === 'production';
  }

  /**
   * Détermine le niveau de log selon l'environnement
   */
  getLogLevel() {
    if (process.env.NODE_ENV === 'production') {
      return LOG_LEVELS.ERROR; // Seulement les erreurs en production
    }
    return LOG_LEVELS.DEBUG; // Tous les logs en développement
  }

  /**
   * Formate les messages de log avec timestamp et contexte
   */
  formatMessage(level, message, context = {}) {
    const timestamp = new Date().toISOString();

    // Sérialisation sûre pour éviter les objets circulaires et valeurs non sérialisables
    const safeSerialize = value => {
      try {
        if (value == null) return '';
        if (typeof value !== 'object') return String(value);
        const seen = new WeakSet();
        return JSON.stringify(value, (key, val) => {
          if (typeof val === 'object' && val !== null) {
            if (seen.has(val)) return '[Circular]';
            seen.add(val);
          }
          if (typeof val === 'function')
            return `[Function ${val.name || 'anonymous'}]`;
          if (val instanceof Error)
            return { name: val.name, message: val.message, stack: val.stack };
          return val;
        });
      } catch {
        return '[Unserializable]';
      }
    };

    const contextStr = safeSerialize(context);

    return {
      timestamp,
      level,
      message,
      context: contextStr,
      environment: process.env.NODE_ENV,
    };
  }

  /**
   * Vérifie si le niveau de log doit être affiché
   */
  shouldLog(level) {
    return level <= this.level;
  }

  /**
   * Log d'erreur - Toujours affiché
   */
  error(message, context = {}) {
    if (!this.shouldLog(LOG_LEVELS.ERROR)) return;

    const formatted = this.formatMessage('ERROR', message, context);

    if (this.isDevelopment) {
      // eslint-disable-next-line no-console
      console.error(`🚨 [${formatted.timestamp}] ${message}`, context);
    }

    // En production, envoyer vers un service de logging
    if (this.isProduction) {
      this.sendToLoggingService(formatted);
    }
  }

  /**
   * Log d'avertissement - Affiché en dev et staging
   */
  warn(message, context = {}) {
    if (!this.shouldLog(LOG_LEVELS.WARN)) return;

    const formatted = this.formatMessage('WARN', message, context);

    if (this.isDevelopment) {
      // eslint-disable-next-line no-console
      console.warn(`⚠️ [${formatted.timestamp}] ${message}`, context);
    }

    if (this.isProduction) {
      this.sendToLoggingService(formatted);
    }
  }

  /**
   * Log d'information - Affiché en développement uniquement
   */
  info(message, context = {}) {
    if (!this.shouldLog(LOG_LEVELS.INFO)) return;

    const formatted = this.formatMessage('INFO', message, context);

    if (this.isDevelopment) {
      // eslint-disable-next-line no-console
      console.info(`ℹ️ [${formatted.timestamp}] ${message}`, context);
    }
  }

  /**
   * Log de débogage - Affiché en développement uniquement
   */
  debug(message, context = {}) {
    if (!this.shouldLog(LOG_LEVELS.DEBUG)) return;

    const formatted = this.formatMessage('DEBUG', message, context);

    if (this.isDevelopment) {
      // eslint-disable-next-line no-console
      console.log(`🐛 [${formatted.timestamp}] ${message}`, context);
    }
  }

  /**
   * Envoie les logs vers un service externe en production
   */
  sendToLoggingService(logData) {
    // TODO: Implémenter l'envoi vers un service de logging (Sentry, LogRocket, etc.)
    // Pour l'instant, on stocke localement
    try {
      const logs = JSON.parse(localStorage.getItem('analysticks_logs') || '[]');
      logs.push(logData);

      // Garder seulement les 100 derniers logs
      if (logs.length > 100) {
        logs.splice(0, logs.length - 100);
      }

      localStorage.setItem('analysticks_logs', JSON.stringify(logs));
    } catch (error) {
      // Fallback silencieux
    }
  }

  /**
   * Récupère les logs stockés localement
   */
  getStoredLogs() {
    try {
      return JSON.parse(localStorage.getItem('analysticks_logs') || '[]');
    } catch {
      return [];
    }
  }

  /**
   * Vide les logs stockés
   */
  clearStoredLogs() {
    localStorage.removeItem('analysticks_logs');
  }
}

// Instance singleton
const logger = new SecureLogger();

// Export des méthodes pour un usage facile
export const log = {
  error: (message, context) => logger.error(message, context),
  warn: (message, context) => logger.warn(message, context),
  info: (message, context) => logger.info(message, context),
  debug: (message, context) => logger.debug(message, context),

  // Utilitaires
  getLogs: () => logger.getStoredLogs(),
  clearLogs: () => logger.clearStoredLogs(),
};

export default logger;
