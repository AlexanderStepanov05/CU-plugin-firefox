document.addEventListener("DOMContentLoaded", () => {
    const autoCleanSwitch = document.getElementById("autoCleanSwitch");
    const clearButton = document.getElementById("clearStates");

    // Получаем состояние autoClean при загрузке страницы
    browser.storage.sync.get(["autoClean"]).then((data) => {
        autoCleanSwitch.checked = data.autoClean || false;
        if (autoCleanSwitch.checked) {
            browser.runtime.sendMessage({ action: "cleanCourses" });
        }
    }).catch((error) => {
        console.error("Error getting storage:", error);
    });

    // Обработчик изменения состояния переключателя
    autoCleanSwitch.addEventListener("change", () => {
        const isChecked = autoCleanSwitch.checked;
        browser.storage.sync.set({ autoClean: isChecked }).then(() => {
            if (isChecked) {
                console.log('autoClean is now enabled, sending cleanCourses message');
                browser.runtime.sendMessage({ action: "cleanCourses" });
            }
        }).catch((error) => {
            console.error("Error setting storage:", error);
        });
    });

    // Обработчик кнопки очистки
    clearButton.addEventListener("click", () => {
        browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
            browser.tabs.sendMessage(tabs[0].id, { action: "clearCheckboxes" });
        }).catch((error) => {
            console.error("Error querying tabs:", error);
        });
    });
});
