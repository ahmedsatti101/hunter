import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldSetBadge: false
  })
});

export async function scheduleReminders(title: string, employer: string, dateToTrigger: Date) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `${title} at ${employer}`,
      body: "It has been two weeks since you applied. Has there been an update since?",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: dateToTrigger.setDate(dateToTrigger.getDate() + 14)
    }
  });

  await Notifications.scheduleNotificationAsync({
    content: {
      title: `${title} at ${employer}`,
      body: "It has been four weeks since you applied. Has there been an update since?",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: dateToTrigger.setDate(dateToTrigger.getDate() + 28)
    }
  });
};
