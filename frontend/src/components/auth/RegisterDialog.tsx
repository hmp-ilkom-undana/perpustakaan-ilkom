import { UserPlus, Loader2, AlertCircle } from "lucide-react";
import { useAuthRegister } from "@/hooks/useAuthRegister";
import { RegisterFormFields } from "./RegisterFormFields";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface RegisterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RegisterDialog({ open, onOpenChange }: RegisterDialogProps) {
  const {
    form,
    registerError,
    showPassword,
    showConfirmPassword,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    handleDialogChange,
    onSubmit,
  } = useAuthRegister({ onOpenChange });

  const {
    formState: { isSubmitting },
  } = form;

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="sm:max-w-lg bg-white border-4 border-blue-900 shadow-[8px_8px_0px_#1E3A8A] rounded-2xl p-6 max-h-[90vh] overflow-y-auto z-[60]">
        <DialogHeader className="border-b-2 border-blue-900 pb-3 text-center sm:text-left">
          <DialogTitle className="text-lg sm:text-xl font-black text-blue-950 uppercase tracking-tight flex items-center justify-center sm:justify-start gap-2">
            <UserPlus className="w-5 h-5 text-orange-500" />
            Buat Akun Mahasiswa
          </DialogTitle>
          <DialogDescription className="text-xs font-bold text-slate-500">
            Lengkapi data identitas berikut untuk mengakses katalog dan
            sirkulasi peminjaman.
          </DialogDescription>
        </DialogHeader>

        {registerError && (
          <div className="p-3 bg-red-100 border-2 border-blue-900 rounded-lg text-red-900 font-bold text-xs shadow-[2px_2px_0px_#1E3A8A] flex items-center gap-2 mt-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{registerError}</span>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <RegisterFormFields
            form={form}
            showPassword={showPassword}
            showConfirmPassword={showConfirmPassword}
            onTogglePassword={togglePasswordVisibility}
            onToggleConfirmPassword={toggleConfirmPasswordVisibility}
          />

          <div className="pt-3 border-t-2 border-blue-900 flex flex-col sm:flex-row items-center gap-2.5">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleDialogChange(false)}
              className="w-full sm:w-1/3 border-2 border-blue-900 font-bold text-blue-900 bg-white shadow-[2px_2px_0px_#1E3A8A] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none h-11 uppercase text-xs cursor-pointer"
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="navy"
              disabled={isSubmitting}
              className="w-full sm:w-2/3 text-white font-black text-sm h-11 rounded-lg border-2 border-blue-900 shadow-[4px_4px_0px_#1E3A8A] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all cursor-pointer uppercase tracking-wider"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Mendaftarkan...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Daftarkan Akun
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
