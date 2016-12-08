/**
 * Created by zsiri on 2016.12.08..
 */


export interface Answer {
    answer: string,
    right?: boolean
}

export interface Pair {
    left: string,
    right: string
}

export interface Element {
    element: string,
    hint: string
}

interface QuestionBase {
    type: string,
    question: string,
    askedId?: string
}

export type Question =
    MultipleAnswerQuestion |
        SingleAnswerQuestion |
        PairingQuestion |
        OrderingQuestion;

export interface MultipleAnswerQuestion extends QuestionBase {
    type: "multiple-answers",
    answers: Answer[]
}

export interface SingleAnswerQuestion extends QuestionBase {
    type: "single-answer",
    answers: Answer[]
}

export interface PairingQuestion extends QuestionBase {
    type: "pairing",
    seed?: {
        pairs: number,
        "left-alone": number,
        "right-alone": number
    },
    pairs: Pair[],
    "left-alone"?: string[],
    "right-alone"?: string[]
}

export interface OrderingQuestion extends QuestionBase {
    type: "ordering",
    elements:Element[]
}
