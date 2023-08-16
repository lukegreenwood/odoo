/* @odoo-module */

import { Command } from "@mail/../tests/helpers/command";
import { click, contains, start, startServer } from "@mail/../tests/helpers/test_utils";
import { patchUiSize } from "@mail/../tests/helpers/patch_ui_size";

QUnit.module("messaging menu (patch)");

QUnit.test('livechats should be in "chat" filter', async () => {
    const pyEnv = await startServer();
    const guestId = pyEnv["mail.guest"].create({ name: "Visitor 11" });
    pyEnv["discuss.channel"].create({
        anonymous_name: "Visitor 11",
        channel_member_ids: [
            [0, 0, { partner_id: pyEnv.currentPartnerId }],
            Command.create({ guest_id: guestId }),
        ],
        channel_type: "livechat",
        livechat_operator_id: pyEnv.currentPartnerId,
    });
    await start();
    await click(".o_menu_systray i[aria-label='Messages']");
    await contains(".o-mail-MessagingMenu button:contains(All).fw-bolder");
    await contains(".o-mail-NotificationItem-name", { text: "Visitor 11" });
    await click(".o-mail-MessagingMenu button", { text: "Chats" });
    await contains(".o-mail-MessagingMenu button:contains(Chat).fw-bolder");
    await contains(".o-mail-NotificationItem-name", { text: "Visitor 11" });
});

QUnit.test('livechats should be in "livechat" tab in mobile', async () => {
    patchUiSize({ height: 360, width: 640 });
    const pyEnv = await startServer();
    const guestId = pyEnv["mail.guest"].create({ name: "Visitor 11" });
    pyEnv["discuss.channel"].create({
        anonymous_name: "Visitor 11",
        channel_member_ids: [
            [0, 0, { partner_id: pyEnv.currentPartnerId }],
            Command.create({ guest_id: guestId }),
        ],
        channel_type: "livechat",
        livechat_operator_id: pyEnv.currentPartnerId,
    });
    await start();
    await click(".o_menu_systray i[aria-label='Messages']");
    await click("button", { text: "Livechat" });
    await contains(".o-mail-NotificationItem", { text: "Visitor 11" });
    await click("button", { text: "Chat" });
    await contains(".o-mail-NotificationItem", { count: 0, text: "Visitor 11" });
});
