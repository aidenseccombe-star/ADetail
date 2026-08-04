"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import {
  type BusyBooking,
  formatLocalDate,
  formatMinutesToDisplay,
  getAvailableSlots,
  getOccupiedRanges,
  isClosedDay,
  isPastDay,
  parseLocalDate,
} from "@/lib/booking-availability";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_FORMATTER = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" });

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function buildMonthGrid(viewDate: Date): (Date | null)[] {
  const first = startOfMonth(viewDate);
  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
  const leadingBlanks = first.getDay();

  const cells: (Date | null)[] = Array.from({ length: leadingBlanks }, () => null);
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(new Date(viewDate.getFullYear(), viewDate.getMonth(), day));
  }
  return cells;
}

type AppointmentCalendarProps = {
  durationMinutes: number;
  initialDate?: string;
  initialTime?: string;
  onChange: (date: string | null, time: string | null) => void;
};

export function AppointmentCalendar({
  durationMinutes,
  initialDate,
  initialTime,
  onChange,
}: AppointmentCalendarProps) {
  const today = useMemo(() => new Date(), []);
  const [viewDate, setViewDate] = useState(() =>
    startOfMonth(initialDate ? parseLocalDate(initialDate) : today)
  );
  const [selectedDate, setSelectedDate] = useState<string | null>(initialDate ?? null);
  const [selectedTime, setSelectedTime] = useState<string | null>(initialTime ?? null);
  const [busyByDate, setBusyByDate] = useState<Map<string, BusyBooking[]>>(new Map());
  const [loadingDate, setLoadingDate] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [supabase] = useState(() => createClient());

  useEffect(() => {
    if (!selectedDate || busyByDate.has(selectedDate)) return;

    let cancelled = false;

    async function loadBusySlots() {
      setLoadingDate(selectedDate);
      setError(null);

      const { data, error: rpcError } = await supabase.rpc("get_busy_slots", {
        p_start_date: selectedDate!,
        p_end_date: selectedDate!,
      });

      if (cancelled) return;

      if (rpcError) {
        setError("Couldn't load availability. Please try again.");
      } else {
        setBusyByDate((prev) => new Map(prev).set(selectedDate!, (data ?? []) as BusyBooking[]));
      }

      setLoadingDate(null);
    }

    loadBusySlots();

    return () => {
      cancelled = true;
    };
  }, [selectedDate, busyByDate, supabase]);

  const occupiedRanges = useMemo(() => {
    if (!selectedDate) return [];
    return getOccupiedRanges(busyByDate.get(selectedDate) ?? []);
  }, [selectedDate, busyByDate]);

  const isSelectedToday = selectedDate === formatLocalDate(today);
  const nowMinutes = today.getHours() * 60 + today.getMinutes();

  const availableSlots = useMemo(() => {
    if (!selectedDate || durationMinutes <= 0) return [];
    return getAvailableSlots(occupiedRanges, durationMinutes, {
      minStartMinutes: isSelectedToday ? nowMinutes : undefined,
    });
  }, [occupiedRanges, durationMinutes, selectedDate, isSelectedToday, nowMinutes]);

  // A previously chosen time can be invalidated by a later duration change
  // (an add-on toggled after a slot was picked) or by fresh availability
  // data coming back once loaded — only ever treat a time as "selected" if
  // it's still in the current available list.
  const effectiveTime = selectedTime && availableSlots.includes(selectedTime) ? selectedTime : null;

  useEffect(() => {
    onChange(selectedDate, effectiveTime);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, effectiveTime]);

  const monthGrid = useMemo(() => buildMonthGrid(viewDate), [viewDate]);

  const disablePrev =
    viewDate.getFullYear() === today.getFullYear() && viewDate.getMonth() === today.getMonth();

  return (
    <div className="flex flex-col gap-6 sm:flex-row">
      <div className="sm:w-72 sm:shrink-0">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
            disabled={disablePrev}
            aria-label="Previous month"
            className="rounded-lg p-1.5 text-ink/60 transition-colors hover:bg-secondary hover:text-ink disabled:pointer-events-none disabled:opacity-30"
          >
            <ChevronLeft className="size-4" aria-hidden />
          </button>
          <p className="text-sm font-semibold text-ink">{MONTH_FORMATTER.format(viewDate)}</p>
          <button
            type="button"
            onClick={() => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
            aria-label="Next month"
            className="rounded-lg p-1.5 text-ink/60 transition-colors hover:bg-secondary hover:text-ink"
          >
            <ChevronRight className="size-4" aria-hidden />
          </button>
        </div>

        <div className="mt-3 grid grid-cols-7 gap-1 text-center text-xs text-ink/40">
          {WEEKDAY_LABELS.map((label) => (
            <span key={label} className="py-1">
              {label}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {monthGrid.map((date, i) => {
            if (!date) return <span key={`blank-${i}`} />;

            const dateStr = formatLocalDate(date);
            const disabled = isClosedDay(date) || isPastDay(date, today);
            const isSelected = dateStr === selectedDate;

            return (
              <button
                key={dateStr}
                type="button"
                disabled={disabled}
                onClick={() => setSelectedDate(dateStr)}
                className={cn(
                  "aspect-square rounded-lg text-sm transition-colors",
                  disabled && "text-ink/20",
                  !disabled && !isSelected && "text-ink/80 hover:bg-secondary",
                  isSelected && "bg-brand font-semibold text-brand-foreground"
                )}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-ink">
          {selectedDate
            ? MONTH_FORMATTER.format(parseLocalDate(selectedDate)).replace(/\d{4}$/, "") +
              parseLocalDate(selectedDate).getDate()
            : "Available times"}
        </p>

        <div className="mt-3 max-h-64 overflow-y-auto pr-1">
          {!selectedDate && <p className="text-sm text-ink/50">Pick a date to see open times.</p>}
          {selectedDate && durationMinutes <= 0 && (
            <p className="text-sm text-ink/50">Choose a service above first.</p>
          )}
          {selectedDate && durationMinutes > 0 && loadingDate === selectedDate && (
            <p className="text-sm text-ink/50">Loading times…</p>
          )}
          {selectedDate && error && <p className="text-sm text-destructive">{error}</p>}
          {selectedDate &&
            durationMinutes > 0 &&
            !error &&
            loadingDate !== selectedDate &&
            availableSlots.length === 0 && (
              <p className="text-sm text-ink/50">
                No times available this day — try another date.
              </p>
            )}

          {selectedDate && durationMinutes > 0 && availableSlots.length > 0 && (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {availableSlots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setSelectedTime(slot)}
                  className={cn(
                    "rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                    slot === effectiveTime
                      ? "border-brand bg-brand text-brand-foreground"
                      : "border-ink/10 text-ink/80 hover:border-brand/40 hover:bg-secondary"
                  )}
                >
                  {formatMinutesToDisplay(Number(slot.slice(0, 2)) * 60 + Number(slot.slice(3)))}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
