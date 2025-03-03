browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "cleanCourses") {
        browser.tabs.query({ active: true, currentWindow: true })
            .then((tabs) => {
                return browser.tabs.sendMessage(tabs[0].id, { action: "cleanAndAddRightClick" });
            })
            .catch((error) => {
                console.error("Error handling cleanCourses message:", error);
            });
    }
    // Возвращаем true для указания асинхронного ответа, если он нужен
    return true;
});
