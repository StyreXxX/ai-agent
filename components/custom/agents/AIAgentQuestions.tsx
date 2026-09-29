"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { ClarificationQuestion } from './CreateAgent'

type Props = {
    questionList: ClarificationQuestion[]
    onComplete?: any
}

function AIAgentQuestions({ questionList, onComplete }: Props) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [answers, setAnswers] = useState<Record<string, string>>({})
    const [customMode, setCustomMode] = useState<Record<string, boolean>>({})

    const currentQuestion = questionList[currentIndex]
    if (!currentQuestion) {
        return null
    }
    const currentAnswer = answers[currentQuestion.id] || ""
    const isCustom = customMode[currentQuestion.id] || false
    const isLastQuestion = currentIndex === questionList.length - 1

    const handleAnswer = (value: string) => {
        setAnswers((prev) => ({
            ...prev,
            [currentQuestion.id]: value,
        }))
    }

    const toggleMultiSelect = (option: string) => {
        const selected = currentAnswer ? currentAnswer.split(',') : []
        const updated = selected.includes(option)
            ? selected.filter((item) => item !== option)
            : [...selected, option]
        handleAnswer(updated.join(','))
    }

    const handleNext = () => {
      if (!currentAnswer.trim()) return

      if (currentIndex < questionList.length - 1) {
          setCurrentIndex((prev) => prev + 1)
      } else {
          const finalAnswers = {
              ...answers,
              [currentQuestion.id]: currentAnswer,
          }

          console.log("Final Answers:", finalAnswers)
          onComplete?.(finalAnswers)
      }
    }

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1)
        }
    }

    return (
        <div className="w-full max-w-xl mx-auto">
            {/* Progress */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">
                        Question {currentIndex + 1} of {questionList.length}
                    </span>
                    <span className="text-sm font-medium">
                        {Math.round(((currentIndex + 1) / questionList.length) * 100)}%
                    </span>
                </div>

                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div
                        className="h-full bg-purple-600 transition-all duration-300"
                        style={{
                            width: `${((currentIndex + 1) / questionList.length) * 100}%`,
                        }}
                    />
                </div>
            </div>

            {/* Question */}
            <div className="min-h-[280px]">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                    Help me understand your request
                </p>
                <h2 className="text-xl font-semibold mb-6">
                    {currentQuestion.question}
                </h2>

                {/* Text */}
                {currentQuestion.type === "text" && (
                    <Input
                        autoFocus
                        value={currentAnswer}
                        placeholder={currentQuestion.customPlaceholder}
                        onChange={(e) => handleAnswer(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && currentAnswer.trim()) handleNext()
                        }}
                        className="h-12 rounded-xl"
                    />
                )}

                {/* Number */}
                {currentQuestion.type === "number" && (
                    <Input
                        autoFocus
                        type="number"
                        value={currentAnswer}
                        placeholder={currentQuestion.customPlaceholder}
                        onChange={(e) => handleAnswer(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && currentAnswer.trim()) handleNext()
                        }}
                        className="h-12 rounded-xl"
                    />
                )}

                {/* Date */}
                {currentQuestion.type === "date" && (
                    <Input
                        autoFocus
                        type="date"
                        value={currentAnswer}
                        onChange={(e) => handleAnswer(e.target.value)}
                        className="h-12 rounded-xl"
                    />
                )}

                {/* Time */}
                {currentQuestion.type === "time" && (
                    <Input
                        autoFocus
                        type="time"
                        value={currentAnswer}
                        onChange={(e) => handleAnswer(e.target.value)}
                        className="h-12 rounded-xl"
                    />
                )}

                {/* Single select */}
                {currentQuestion.type === "single_select" && (
                    <div className="flex flex-col gap-2">
                        {currentQuestion.options.map((option) => (
                            <button
                                key={option}
                                onClick={() => {
                                    setCustomMode((prev) => ({ ...prev, [currentQuestion.id]: false }))
                                    handleAnswer(option)
                                }}
                                className={`flex items-center justify-between text-left px-4 py-3 rounded-xl border transition-colors ${
                                    currentAnswer === option && !isCustom
                                        ? 'border-purple-600 bg-purple-50 text-purple-700'
                                        : 'border-border hover:border-purple-300 hover:bg-purple-50/50'
                                }`}
                            >
                                <span className="text-sm">{option}</span>
                                {currentAnswer === option && !isCustom && (
                                    <Check className="h-4 w-4 text-purple-600" />
                                )}
                            </button>
                        ))}

                        {currentQuestion.allowCustom && (
                            !isCustom ? (
                                <button
                                    onClick={() => {
                                        setCustomMode((prev) => ({ ...prev, [currentQuestion.id]: true }))
                                        handleAnswer('')
                                    }}
                                    className="text-left px-4 py-3 rounded-xl border border-dashed border-border hover:border-purple-300 hover:bg-purple-50/50 text-sm text-muted-foreground"
                                >
                                    + Enter a custom answer
                                </button>
                            ) : (
                                <Input
                                    autoFocus
                                    value={currentAnswer}
                                    placeholder={currentQuestion.customPlaceholder}
                                    onChange={(e) => handleAnswer(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && currentAnswer.trim()) handleNext()
                                    }}
                                    className="h-12 rounded-xl"
                                />
                            )
                        )}
                    </div>
                )}

                {/* Multi select */}
                {currentQuestion.type === "multi_select" && (
                    <div className="flex flex-col gap-2">
                        {currentQuestion.options.map((option) => {
                            const selected = currentAnswer ? currentAnswer.split(',') : []
                            const isSelected = selected.includes(option)
                            return (
                                <button
                                    key={option}
                                    onClick={() => toggleMultiSelect(option)}
                                    className={`flex items-center justify-between text-left px-4 py-3 rounded-xl border transition-colors ${
                                        isSelected
                                            ? 'border-purple-600 bg-purple-50 text-purple-700'
                                            : 'border-border hover:border-purple-300 hover:bg-purple-50/50'
                                    }`}
                                >
                                    <span className="text-sm">{option}</span>
                                    {isSelected && <Check className="h-4 w-4 text-purple-600" />}
                                </button>
                            )
                        })}

                        {currentQuestion.allowCustom && (
                            <Input
                                placeholder={currentQuestion.customPlaceholder}
                                onKeyDown={(e) => {
                                    const target = e.target as HTMLInputElement
                                    if (e.key === "Enter" && target.value.trim()) {
                                        const selected = currentAnswer ? currentAnswer.split(',') : []
                                        handleAnswer([...selected, target.value.trim()].join(','))
                                        target.value = ''
                                    }
                                }}
                                className="h-12 rounded-xl mt-1"
                            />
                        )}
                    </div>
                )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6">
                <Button
                    variant="ghost"
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                    className="text-muted-foreground disabled:opacity-40"
                >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Previous
                </Button>

                <Button
                    onClick={handleNext}
                    disabled={!currentAnswer.trim()}
                    className="bg-purple-600 hover:bg-purple-700 rounded-full px-5"
                >
                    {isLastQuestion ? 'Finish' : 'Next'}
                    <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
            </div>
        </div>
    )
}

export default AIAgentQuestions