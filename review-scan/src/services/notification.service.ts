import notifee, {
  AndroidImportance,
  TimestampTrigger,
  TriggerType,
} from '@notifee/react-native';
import {Reminder} from '../redux/slices/reminder.slice';

export async function addNotification(
  notificationTitle: string,
  reminder: Reminder,
) {
  const rmid = reminder.id || '';
  await notifee.requestPermission({
    criticalAlert: true,
  });
  const triggerDate = new Date(reminder.date);

  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    repeatFrequency: reminder.freq,
    timestamp: triggerDate.getTime(),
  };

  const channelId = await notifee.createChannel({
    id: rmid,
    name: reminder.title,
  });

  await notifee.createTriggerNotification(
    {
      id: rmid,
      title: notificationTitle,
      body: reminder.title,
      data: {
        reminderId: rmid,
      },
      android: {
        smallIcon: 'ic_notification',
        channelId,
        importance: AndroidImportance.HIGH,
        pressAction: {
          id: 'default',
          launchActivity: 'default',
        },
      },
      ios: {
        critical: true,
        interruptionLevel: 'critical',
      },
    },
    trigger,
  );
}
export async function removeNotification(reminderId: string) {
  await notifee.cancelNotification(reminderId);
}

export async function removeAllNotifications() {
  await notifee.cancelAllNotifications();
}
