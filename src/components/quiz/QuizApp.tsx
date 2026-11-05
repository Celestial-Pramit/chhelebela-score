"use client";

import { useEffect, useRef, useState } from "react";
import { MotionConfig, useReducedMotion } from "motion/react";
import TvFrame from "@/components/shared/TvFrame";
import { CHANNELS, itemsByChannel, type ChannelId } from "@/data/items";
import {
  computeScore,
  getDoneChannels,
  toBanglaDigits,
  type Answer,
  type Answers,
} from "@/lib/scoring";
import {
  clear,
  createDefaultState,
  load,
  save,
  type StoredView,
} from "@/lib/storage";
import {
  FINISH_CONFIRM,
  FINISH_QUESTION,
  FINISH_REVIEW,
  FINISH_UNTOUCHED_LINE,
  FINISH_YES_LINE,
  INSTRUCTION_LINE,
  INSTRUCTION_NOTE,
} from "@/lib/copy";
import { countUntouched, getNextRemainingChannel, shouldConfirmFinish } from "@/lib/quiz";
import ChannelTabs from "./ChannelTabs";
import MemoryCard from "./MemoryCard";
import QuizActionBar from "./QuizActionBar";
import QuizTv from "./QuizTv";
import ResultCard from "./ResultCard";

type DialogKind = "finish" | "reset" | "partial" | null;

function QuizDialog({
  kind,
  yesCount,
  untouchedCount,
  onCancel,
  onConfirm,
  onReview,
  onBack,
}: {
  kind: DialogKind;
  yesCount: number;
  untouchedCount: number;
  onCancel: () => void;
  onConfirm: () => void;
  onReview?: () => void;
  onBack?: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !kind) return;
    if (!dialog.open) dialog.showModal();
    dialog.querySelector<HTMLButtonElement>("button")?.focus();
  }, [kind]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleCancel = (event: Event) => {
      event.preventDefault();
      onCancel();
    };
    dialog.addEventListener("cancel", handleCancel);
    return () => dialog.removeEventListener("cancel", handleCancel);
  }, [onCancel]);

  if (!kind) return null;
  const isReset = kind === "reset";
  const isPartial = kind === "partial";
  return (
    <dialog
      ref={dialogRef}
      className="quiz-dialog"
      aria-labelledby="quiz-dialog-title"
      onClose={onCancel}
    >
      {isReset ? (
        <>
          <h2 id="quiz-dialog-title" className="font-display text-2xl font-extrabold">
            আবার শুরু করবে?
          </h2>
          <p className="mt-2 font-semibold">সব টিক ও শেষ করা চ্যানেল মুছে যাবে।</p>
        </>
      ) : isPartial ? (
        <>
          <h2 id="quiz-dialog-title" className="font-display text-2xl font-extrabold">
            রেজাল্ট দেখবে?
          </h2>
          <p className="mt-2 font-semibold">যে চ্যানেলগুলো বাকি আছে সেগুলো স্কোরে ধরা হবে না।</p>
        </>
      ) : (
        <>
          <h2 id="quiz-dialog-title" className="font-display text-2xl font-extrabold">
            {FINISH_QUESTION}
          </h2>
          <p className="mt-2 font-semibold">{FINISH_YES_LINE(yesCount)}</p>
          <p className="font-semibold">{FINISH_UNTOUCHED_LINE(untouchedCount)}</p>
        </>
      )}
      <div className="mt-5 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={isReset ? onCancel : isPartial ? onBack : onReview}
          className="min-h-11 rounded-full border-2 border-night px-4 font-display font-bold focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-night"
        >
          {isReset ? "এখন নয়" : isPartial ? "আরও চ্যানেল দেখি" : FINISH_REVIEW}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="min-h-11 rounded-full border-2 border-night bg-marigold px-4 font-display font-bold shadow-[3px_3px_0_#15152d] focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-night"
        >
          {isReset ? "হ্যাঁ, শুরু করি" : isPartial ? "তবুও রেজাল্ট দেখো" : FINISH_CONFIRM}
        </button>
      </div>
    </dialog>
  );
}

export default function QuizApp() {
  const [answers, setAnswers] = useState<Answers>({});
  const [doneChannels, setDoneChannels] = useState<ChannelId[]>([]);
  const [currentChannel, setCurrentChannel] = useState<ChannelId>("tv");
  const [view, setView] = useState<StoredView>("quiz");
  const [loaded, setLoaded] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [dialog, setDialog] = useState<DialogKind>(null);
  const [message, setMessage] = useState("");
  const reducedMotion = useReducedMotion() ?? false;
  const transitionTimeoutRef = useRef<number | null>(null);
  const headingFocusTimeoutRef = useRef<number | null>(null);
  const channelHeadingRef = useRef<HTMLHeadingElement>(null);
  const resultHeadingFocusTimeoutRef = useRef<number | null>(null);
  const dialogTriggerRef = useRef<HTMLElement | null>(null);
  const hasInitializedViewRef = useRef(false);
  const [reviewFocusItemId, setReviewFocusItemId] = useState<string | null>(null);

  const currentIndex = CHANNELS.findIndex((channel) => channel.id === currentChannel);
  const currentItems = itemsByChannel(currentChannel);
  const currentYesCount = currentItems.filter((item) => answers[item.id] === "yes").length;
  const done = getDoneChannels(doneChannels);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const stored = load();
      setAnswers(stored.answers);
      setDoneChannels(stored.doneChannels);
      setCurrentChannel(stored.currentChannel);
      setView(stored.view);
      setLoaded(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    save({ version: 1, answers, doneChannels, currentChannel, view });
  }, [answers, currentChannel, doneChannels, loaded, view]);

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current !== null) {
        window.clearTimeout(transitionTimeoutRef.current);
      }
      if (headingFocusTimeoutRef.current !== null) {
        window.clearTimeout(headingFocusTimeoutRef.current);
      }
      if (resultHeadingFocusTimeoutRef.current !== null) {
        window.clearTimeout(resultHeadingFocusTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!loaded || view !== "quiz" || showCompletion) return;
    if (!hasInitializedViewRef.current) {
      hasInitializedViewRef.current = true;
      return;
    }
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
    if (headingFocusTimeoutRef.current !== null) {
      window.clearTimeout(headingFocusTimeoutRef.current);
    }
    headingFocusTimeoutRef.current = window.setTimeout(() => channelHeadingRef.current?.focus(), 0);
    return () => {
      if (headingFocusTimeoutRef.current !== null) {
        window.clearTimeout(headingFocusTimeoutRef.current);
      }
    };
  }, [currentChannel, loaded, reducedMotion, showCompletion, view]);

  useEffect(() => {
    if (!loaded || view !== "result") return;
    hasInitializedViewRef.current = true;
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
    if (resultHeadingFocusTimeoutRef.current !== null) {
      window.cancelAnimationFrame(resultHeadingFocusTimeoutRef.current);
    }
    resultHeadingFocusTimeoutRef.current = window.requestAnimationFrame(() => {
      document.getElementById("result-title")?.focus();
    });
    return () => {
      if (resultHeadingFocusTimeoutRef.current !== null) {
        window.cancelAnimationFrame(resultHeadingFocusTimeoutRef.current);
      }
    };
  }, [loaded, reducedMotion, view]);

  useEffect(() => {
    if (dialog !== null || reviewFocusItemId === null) return;
    const itemId = reviewFocusItemId;
    const focusFrame = window.requestAnimationFrame(() => {
      document.getElementById(`memory-card-${itemId}`)?.querySelector<HTMLButtonElement>("button")?.focus();
      setReviewFocusItemId(null);
    });
    return () => window.cancelAnimationFrame(focusFrame);
  }, [dialog, reviewFocusItemId]);

  function changeChannel(channelId: ChannelId) {
    setMessage("");
    if (transitionTimeoutRef.current !== null) {
      window.clearTimeout(transitionTimeoutRef.current);
    }
    setIsChanging(!reducedMotion);
    setCurrentChannel(channelId);
    if (!reducedMotion) {
      transitionTimeoutRef.current = window.setTimeout(() => setIsChanging(false), 320);
    }
  }

  function handleAnswer(itemId: string, answer: Answer | undefined) {
    setAnswers((previous) => {
      const next = { ...previous };
      if (answer) next[itemId] = answer;
      else delete next[itemId];
      return next;
    });
  }

  function completeChannel() {
    const nextDone = getDoneChannels([...doneChannels, currentChannel]);
    setDoneChannels(nextDone);
    const nextChannel = getNextRemainingChannel(CHANNELS, currentChannel, nextDone);
    if (!nextChannel) {
      setShowCompletion(true);
      return;
    }
    changeChannel(nextChannel);
  }

  function finishChannel() {
    const untouchedCount = countUntouched(currentItems, answers);
    if (shouldConfirmFinish(untouchedCount)) {
      openDialog("finish");
      return;
    }
    completeChannel();
  }

  function handleResult() {
    if (done.length < 3) return;
    if (done.length < CHANNELS.length) {
      openDialog("partial");
      return;
    }
    setView("result");
  }

  function openDialog(kind: Exclude<DialogKind, null>) {
    dialogTriggerRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setDialog(kind);
  }

  function closeDialog({ restoreFocus = true }: { restoreFocus?: boolean } = {}) {
    setDialog(null);
    const trigger = dialogTriggerRef.current;
    dialogTriggerRef.current = null;
    if (restoreFocus && trigger?.isConnected) {
      window.requestAnimationFrame(() => trigger.focus());
    }
  }

  function resetQuiz() {
    clear();
    const initial = createDefaultState();
    setAnswers(initial.answers);
    setDoneChannels(initial.doneChannels);
    setCurrentChannel(initial.currentChannel);
    setView(initial.view);
    setShowCompletion(false);
    closeDialog({ restoreFocus: false });
    setMessage("");
    changeChannel(initial.currentChannel);
  }

  if (!loaded) {
    return (
      <MotionConfig reducedMotion="user">
        <main className="paper min-h-screen px-4 py-8">
          <div className="mx-auto max-w-5xl animate-pulse">
            <div className="h-8 rounded bg-night/10" />
            <div className="mx-auto mt-8 h-64 max-w-md rounded-xl bg-night/10" />
            <div className="mt-8 h-12 rounded-full bg-night/10" />
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="h-32 rounded-lg bg-night/10" />
              <div className="h-32 rounded-lg bg-night/10" />
            </div>
          </div>
        </main>
      </MotionConfig>
    );
  }

  if (view === "result") {
    const score = computeScore({ answers, doneChannels: done });
    return (
      <MotionConfig reducedMotion="user">
        <>
          <ResultCard
            score={score}
            onBack={() => setView("quiz")}
            onReset={() => openDialog("reset")}
          />
          <QuizDialog
            kind={dialog}
            yesCount={0}
            untouchedCount={0}
            onCancel={closeDialog}
            onConfirm={resetQuiz}
          />
        </>
      </MotionConfig>
    );
  }

  if (showCompletion) {
    return (
      <MotionConfig reducedMotion="user">
        <main className="paper flex min-h-screen flex-col items-center justify-center px-4 text-center">
          <h1 className="font-display text-4xl font-extrabold">সব চ্যানেল ঘুরে দেখা শেষ!</h1>
          <p className="mt-3 font-semibold">তোমার ছেলেবেলার গল্প এবার একসঙ্গে দেখা যাবে।</p>
          <button
            type="button"
            onClick={() => setView("result")}
            className="mt-6 min-h-11 rounded-full border-2 border-night bg-marigold px-5 font-display font-bold shadow-[3px_3px_0_#15152d] focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-night"
          >
            রেজাল্ট দেখো
          </button>
          <button
            type="button"
            onClick={() => setShowCompletion(false)}
            className="mt-4 min-h-10 px-3 text-sm font-semibold underline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-night"
          >
            চ্যানেলে ফিরে যাও
          </button>
          <button
            type="button"
            onClick={() => openDialog("reset")}
            className="mt-2 min-h-10 px-3 text-sm font-semibold underline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-night"
          >
            নতুন করে শুরু
          </button>
          <QuizDialog
            kind={dialog}
            yesCount={0}
            untouchedCount={0}
            onCancel={closeDialog}
            onConfirm={resetQuiz}
          />
        </main>
      </MotionConfig>
    );
  }

  const channel = CHANNELS[currentIndex];
  const resultMessage =
    done.length < 3 ? `রেজাল্ট দেখতে অন্তত ${toBanglaDigits(3)}টি চ্যানেল শেষ করো` : undefined;

  return (
    <MotionConfig reducedMotion="user">
      <main className="paper min-h-screen overflow-x-clip pb-32 md:pb-10">
      <h1 className="sr-only">ছেলেবেলার স্মৃতি কুইজ</h1>
      <header className="border-b-4 border-double border-night px-4 py-3">
        <div className="mx-auto flex max-w-5xl items-center justify-between font-display text-xs font-bold sm:text-sm">
          <span>ছেলেবেলা চ্যানেল · কুইজ</span>
          <span>১৯৯০ – ২০০৯</span>
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-3 py-5 sm:px-5 md:py-8">
        <div className="mx-auto w-[17rem] max-w-full md:w-[28rem]">
          <TvFrame
            screenKey={currentChannel}
            channel={toBanglaDigits(currentIndex + 1)}
            delay={0.05}
            onChannelKnob={() =>
              changeChannel(CHANNELS[(currentIndex + 1) % CHANNELS.length].id)
            }
            reducedMotion={reducedMotion}
          >
            <QuizTv
              channel={channel}
              channelIndex={currentIndex}
              channels={CHANNELS}
              doneChannels={done}
              itemCount={currentItems.length}
              yesCount={currentYesCount}
              isChanging={isChanging}
              reducedMotion={reducedMotion}
            />
          </TvFrame>
        </div>
        <div className="mt-5">
          <ChannelTabs
            channels={CHANNELS}
            currentChannel={currentChannel}
            doneChannels={done}
            onSelect={changeChannel}
            reducedMotion={reducedMotion}
          />
        </div>
        <section className="mx-auto mt-5 max-w-5xl">
          <h2
            ref={channelHeadingRef}
            tabIndex={-1}
            className="mb-3 font-display text-2xl font-extrabold focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-night"
          >
            {channel.name}
          </h2>
          <div className="mb-5 rounded-lg border-2 border-night/30 bg-paper/70 px-4 py-3">
            <p className="font-semibold">{INSTRUCTION_LINE}</p>
            <p className="mt-1 text-sm font-semibold text-night/70">{INSTRUCTION_NOTE}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {currentItems.map((item, index) => (
              <MemoryCard
                key={item.id}
                item={item}
                answer={answers[item.id]}
                index={index}
                reducedMotion={reducedMotion}
                onAnswer={(answer) => handleAnswer(item.id, answer)}
              />
            ))}
          </div>
        </section>
        {message && (
          <p
            role="status"
            className="mx-auto mt-5 max-w-xl rounded-lg border-2 border-night bg-marigold px-4 py-2 text-center font-semibold"
          >
            {message}
          </p>
        )}
      </div>
      <QuizActionBar
        currentIndex={currentIndex}
        channelCount={CHANNELS.length}
        doneCount={done.length}
        resultMessage={resultMessage}
        onPrevious={() => {
          if (currentIndex > 0) changeChannel(CHANNELS[currentIndex - 1].id);
        }}
        onNext={finishChannel}
        onResult={handleResult}
        onReset={() => openDialog("reset")}
      />
      <QuizDialog
        kind={dialog}
        yesCount={currentYesCount}
        untouchedCount={countUntouched(currentItems, answers)}
        onCancel={closeDialog}
        onConfirm={() => {
          if (dialog === "reset") resetQuiz();
          else if (dialog === "partial") {
            closeDialog({ restoreFocus: false });
            setView("result");
          } else {
            closeDialog({ restoreFocus: false });
            completeChannel();
          }
        }}
        onReview={() => {
          const firstUntouched = currentItems.find((item) => answers[item.id] === undefined);
          setReviewFocusItemId(firstUntouched?.id ?? null);
          closeDialog({ restoreFocus: false });
        }}
        onBack={closeDialog}
      />
      </main>
    </MotionConfig>
  );
}
