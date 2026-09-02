import { ListNode } from "../../../data_structures/linked-list/linked-list";
import { findCycleStart } from "./find-cycle-start";

/**
 * 
 * @param {ListNode | null} head 
 * @returns {boolean}
 */
export function removeCycle(head) {

    const cycleStart = findCycleStart(head)

    if (cycleStart == null) return false;

    let current = cycleStart

    while (current.next !== cycleStart) {
        current = current.next
    }

    current.next = null

    return true
}   