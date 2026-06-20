/** Storing this in tasks.json is unwieldy, so it lives here.
 * If a task's id appears in the exported object, that value gets attached to the task as the `moreInfo` property by `_prepTasks()`.
 */

import * as C from "./constants.js";
import { factionIcon } from "./functions.js";

const factions = `<p>The Faction Syndicates are
                 ${factionIcon("FactionSigilRebels.png")}Steel Meridian,
                 ${factionIcon("FactionSigilJudge.png")}Arbiters of Hexis,
                 ${factionIcon("FactionSigilOracle.png")}Cephalon Suda,
                 ${factionIcon("FactionSigilBusiness.png")}The Perrin Sequence,
                 ${factionIcon("FactionSigilAssassins.png")}Red Veil,
                 and ${factionIcon("FactionSigilChurch.png")}New Loka.</p>
                 <p>Pledge your loyalty to a faction syndicate at the Syndicates console in your ${C.BASE_OF_OPERATIONS_TOOLTIP}.</p>`

export default {
    daily_first_win_bonus: `<p>Your first completed mission after the daily reset gives double <em>base credit rewards</em>. This only applies to the end-of-mission bonus, and does <strong>not</strong> apply to credits picked up in the mission.</p>
    <p>It also does <strong>not</strong> apply to the following mission types and locations:</p>
    <ul>
        <li><strong>The Index</strong></li>
        <li>Open Worlds (including Profit Taker)</li>
        <li>Zariman</li>
        <li>Höllvania (including Techrot safes)</li>
    </ul>
    <p>Completing any of these missions will consume the bonus without awarding extra credits.</p>
    <p>The bonus <strong>does</strong> stack with Credit Boosters, Credit Blessings, and double Credit events. Travelling to a relay or other non-mission area does <strong>not</strong> consume the bonus.</p>
    <p>Some good missions to use it on include:</p>
    <table>
        <thead><tr>
            <th>Name</th>
            <th>Type</th>
            <th>Base Credits</th>
            <th>Enemy Level</th>
        </tr></thead>
        <tbody>
            <tr>
                <td>Tikal, Earth</td>
                <td>Dark Sector Excavation</td>
                <td>13,500</td>
                <td>6 - 16</td>
            </tr>
            <tr>
                <td>Gabii, Ceres</td>
                <td>Dark Sector Survival</td>
                <td>22,400</td>
                <td>15 - 25</td>
            </tr>
            <tr>
                <td>Bendar Cluster, Earth Proxima</td>
                <td>Railjack Skirmish</td>
                <td>48,800</td>
                <td>29 - 36</td>
            </tr>
            <tr>
                <td>Sabmir Cloud, Veil Proxima</td>
                <td>Railjack Spy</td>
                <td>156,600</td>
                <td>56 - 60</td>
            </tr>
        </tbody>
    </table>
    <p>See <a href="https://wiki.warframe.com/w/Daily_Tribute#Daily_First_Win_Bonus">Daily First Win Bonus</a>, <a href="https://wiki.warframe.com/w/Dark_Sectors">Dark Sectors</a>, and <a href="https://wiki.warframe.com/w/Mission#Locations">Mission</a> on the wiki for more details.</p>
    <p>(There's currently a visual bug where the bonus credits don't appear on the mission completion screen. They <em>are</em> still added to your account though.)</p>`,

    daily_syndicate_gain: factions,
    daily_syndicate_spend: factions,

    weekly_clan_initiative: `<p>Play in a squad with other members of your Clan to earn bonus resources for your Clan Vault. The bonus resources also contribute to your personal rewards track for the week. Progress is based on the amount of resources collected in missions with your clan members.</p>
    <p>Each week, a random planet will reward double bonus Vault resources (and double reward track progress) for missions played there.</p>
    <p>Check the current boosted planet and track your reward progress in the Clan menu.</p>
    <p><strong>Note:</strong> You can use the "Clan Only" matchmaking option to join squads with your Clan or Alliance members, but playing with Alliance members does <em>not</em> give bonus Vault resources or reward progress.</p>
    <p>* Descendia missions do not contribute to Clan Weekly Initiatives.</p>`
}
