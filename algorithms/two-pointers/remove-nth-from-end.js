import { ListNode } from "../../data_structures/linked-list/linked-list";

/**
 * 
 * @param {ListNode | null} head 
 * @param {number} n 
 * @returns {ListNode | null}
 */
export function removeNthFromEnd(head, n) {
    const dummy = new ListNode(0);
    dummy.next = head;

    let slow = dummy;
    let fast = dummy;

    // Create a gap of n + 1
    for (let i = 0; i <= n; i++) {
        fast = fast.next;
    }

    // Move both pointers until fast reaches the end
    while (fast !== null) {
        slow = slow.next;
        fast = fast.next;
    }

    // Remove the target node
    slow.next = slow.next.next;

    return dummy.next;
}