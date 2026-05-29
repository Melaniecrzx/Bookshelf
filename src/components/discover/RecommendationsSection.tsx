import { Sparkles, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useRecommendations } from "@/hooks/useRecommendations";
import { RecommendationCard } from "./RecommendationCard";

export function RecommendationsSection() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const { mutate, isPending, data, isError, reset } = useRecommendations();

  // ── Mode invité ────────────────────────────────────────────────────────────
  if (!session) {
    return (
      <section className="mt-10">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={16} strokeWidth={1.75} className="text-terra-500" />
          <h2 className="font-serif text-xl font-bold text-ink-900">
            For you
          </h2>
        </div>

        <div className="flex flex-col items-center gap-4 py-10 px-6 rounded-2xl bg-sand-100 border border-sand-200 text-center">
          <div className="w-10 h-10 rounded-full bg-sand-200 flex items-center justify-center">
            <Lock size={18} strokeWidth={1.75} className="text-ink-400" />
          </div>
          <div>
            <p className="font-serif text-base font-bold text-ink-900 mb-1">
              Personalized recommendations
            </p>
            <p className="font-sans text-sm text-ink-400 leading-relaxed max-w-xs">
              Sign in so we can suggest books based on what you've already loved.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate("/signup")}
              className="px-4 py-2 rounded-xl bg-terra-500 hover:bg-terra-600 font-sans text-sm font-semibold text-white transition-colors"
            >
              Create account
            </button>
            <button
              onClick={() => navigate("/signin")}
              className="px-4 py-2 rounded-xl border border-terra-500 font-sans text-sm font-semibold text-terra-500 hover:bg-terra-500/10 transition-colors"
            >
              Sign in
            </button>
          </div>
        </div>
      </section>
    );
  }

  // ── Utilisateur connecté ───────────────────────────────────────────────────
  return (
    <section className="mt-10">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles size={16} strokeWidth={1.75} className="text-terra-500" />
        <h2 className="font-serif text-xl font-bold text-ink-900">
          For you
        </h2>
      </div>

      {/* État initial — bouton */}
      {!data && !isPending && !isError && (
        <div className="flex flex-col items-center gap-3 py-10 px-6 rounded-2xl bg-sand-100 border border-sand-200 text-center">
          <p className="font-sans text-sm text-ink-400 leading-relaxed max-w-xs">
            We'll pick 5 books based on your reading history and ratings.
          </p>
          <button
            onClick={() => mutate()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-terra-500 hover:bg-terra-600 font-sans text-sm font-semibold text-white transition-colors"
          >
            <Sparkles size={15} strokeWidth={2} />
            Get recommendations
          </button>
        </div>
      )}

      {/* État chargement */}
      {isPending && (
        <div className="flex flex-col items-center gap-3 py-10 px-6 rounded-2xl bg-sand-100 border border-sand-200 text-center">
          <div className="w-6 h-6 rounded-full border-2 border-terra-300 border-t-terra-500 animate-spin" />
          <p className="font-sans text-sm text-ink-400">
            Finding books you'll love…
          </p>
        </div>
      )}

      {/* État erreur */}
      {isError && (
        <div className="flex flex-col items-center gap-3 py-10 px-6 rounded-2xl bg-sand-100 border border-sand-200 text-center">
          <p className="font-sans text-sm text-ink-400">
            Something went wrong. Please try again.
          </p>
          <button
            onClick={() => { reset(); mutate(); }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-terra-500 hover:bg-terra-600 font-sans text-sm font-semibold text-white transition-colors"
          >
            Try again
          </button>
        </div>
      )}

      {/* Résultats */}
      {data && data.length > 0 && (
        <div className="flex flex-col gap-3">
          {data.map((rec, i) => (
            <RecommendationCard
              key={i}
              title={rec.title}
              author={rec.author}
              reason={rec.reason}
            />
          ))}

          {/* Relancer */}
          <button
            onClick={() => { reset(); mutate(); }}
            className="self-center mt-1 inline-flex items-center gap-1.5 font-sans text-xs font-semibold text-terra-500 hover:text-terra-600 transition-colors"
          >
            <Sparkles size={13} strokeWidth={2} />
            Refresh suggestions
          </button>
        </div>
      )}
    </section>
  );
}
