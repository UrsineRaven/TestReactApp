import useLocalStorage from '../hooks/useLocalStorage';

/**
 * Hook to manage the settings and local storage.
 * @returns {{
 *    pollInterval:number,
 *    setPollInterval:(pollInterval:number)=>void,
 *    showHiddenTypes:boolean,
 *    setShowHiddenTypes:(showHiddenTypes:boolean)=>void,
 *    timeSinceFormat:string|boolean,
 *    setTimeSinceFormat:(timeSinceFormat:string|boolean)=>void,
 *    allowOfflineChanges:boolean,
 *    setAllowOfflineChanges:(allowOfflineChanges:boolean)=>void,
 *    offlineOnly:boolean,
 *    setOfflineOnly:(offlineOnly:boolean)=>void
 * }} Object with settings and their setters.
 */
function useSettings() {
  const [pollInterval, setPollInterval] = useLocalStorage('poll-interval', 0);
  const [showHiddenTypes, setShowHiddenTypes] = useLocalStorage(
    'show-hidden-types',
    false
  );
  const [timeSinceFormat, setTimeSinceFormat] = useLocalStorage(
    'time-since-format',
    false
  );
  const [allowOfflineChanges, setAllowOfflineChanges] = useLocalStorage(
    'allow-offline-changes',
    false
  );
  const [offlineOnly, setOfflineOnly] = useLocalStorage(
    'offline-only',
    process.env.REACT_APP_SETTINGS_DEFAULTS_OFFLINEONLY
  );

  return {
    pollInterval: pollInterval,
    setPollInterval: setPollInterval,
    showHiddenTypes: showHiddenTypes,
    setShowHiddenTypes: setShowHiddenTypes,
    timeSinceFormat: timeSinceFormat,
    setTimeSinceFormat: setTimeSinceFormat,
    allowOfflineChanges: allowOfflineChanges,
    setAllowOfflineChanges: setAllowOfflineChanges,
    offlineOnly: offlineOnly,
    setOfflineOnly: setOfflineOnly
  };
}

export default useSettings;
