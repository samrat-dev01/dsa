import { ListNode } from "../../data_structures/linked-list/linked-list.js";

/**
 * @param {ListNode | null} head
 * @returns {ListNode | null}
 */
export function findMiddle(head) {
    let fast = head, slow = head;

    while (fast && fast.next) {
        slow = slow.next
        fast = fast.next.next
    }

    return slow
}