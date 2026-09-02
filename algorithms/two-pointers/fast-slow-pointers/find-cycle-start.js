import { ListNode } from "../../../data_structures/linked-list/linked-list.js";

/**
 * @param {ListNode | null} head
 * @returns {ListNode | null}
 */
export function findCycleStart(head) {
    let fast = head, slow = head;

    while (fast && fast.next) {
        slow = slow.next
        fast = fast.next.next

        let pointer = head;

        if (slow === fast) {

            while (pointer !== slow) {
                pointer = pointer.next
                slow = slow.next
            }

            return pointer
        }

    }

    return null
}