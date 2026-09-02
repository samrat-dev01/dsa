import { ListNode } from "../../data_structures/linked-list/linked-list.js";

/**
 * @param {ListNode | null} head
 * @returns {boolean}
 */
export function hasCycle(head) {
    let fast = head, slow = head;

    while (fast && fast.next) {
        slow = slow.next
        fast = fast.next.next

        if (slow === fast) {
            return true
        }
    }

    return false
}