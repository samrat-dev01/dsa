import { ListNode } from "../../data_structures/linked-list/linked-list";

/**
 * 
 * @param {ListNode | null} listA 
 * @param {ListNode | null} listB 
 */
export function mergeTwoSortedList(listA, listB) {
    let dummy = new ListNode()
    let current = dummy

    while (listA && listB) {

        if (listA.value <= listB.value) {
            current.next = listA
            listA = listA.next
        } else {
            current.next = listB
            listB = listB.next
        }

        current = current.next
    }

    if (listA) {
        current.next = listA
    }
    else {
        current.next = listB
    }

    return dummy.next
}