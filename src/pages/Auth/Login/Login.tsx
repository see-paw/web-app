import LabeledInput from "@/components/common/LabeledInput/LabeledInput";
import seepaw from "@/assets/seepaw.png"
import {type SubmitHandler, useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useMutation} from "@tanstack/react-query";
import {type LoginResult, useAuth} from "@/hooks/useAuth";
import type {ApiError} from "@/types/apierrors";
import toast from "react-hot-toast";
import {Link, useNavigate} from "react-router-dom";
import {useAuthStore} from "@/stores/auth.store";
import styles from "./Login.module.css";

const loginSchema = z.object({
    email: z.email("O email não tem um formato válido"),
    password: z.string().min(8, "A password deve ter pelo menos 8 caracteres")
})

export type LoginCredentials = z.infer<typeof loginSchema>;

function Login() {
    const {register, handleSubmit, setError, formState: {errors}} = useForm<LoginCredentials>({resolver: zodResolver(loginSchema)});
    const {login} = useAuth();
    const navigate = useNavigate();

    const { mutate, isPending } = useMutation<LoginResult, ApiError, LoginCredentials>({
        mutationFn: async (credentials) => {
            const result =  await login(credentials)

            if (!result.success) {
                throw result?.error;
            }

            return result;
        },
        onSuccess: async () => {
            toast.success("Bem vindo à SeePaw!!");

            const currentUser = useAuthStore.getState().user;
            
            if (currentUser?.role === "AdminCAA") {
                navigate("/admin");
            } else {
                navigate("/animals");
            }
        },
        onError: (apiError) => {
            setError("root", { message: apiError.message });
        }
    });

    const onSubmit : SubmitHandler<LoginCredentials> = function (data) {
        mutate(data)
    }

    return (
        <section className={styles.loginSection}>
            <div className={styles.loginContainer}>
                <div className={styles.logoContainer}>
                    <img src={seepaw} alt="Seepaw" className={styles.logo} />
                </div>
                {errors.root && <div className={styles.errorMessage}>{errors.root.message}</div>}
                <form onSubmit={handleSubmit(onSubmit)} className={styles.loginForm} noValidate>
                    <LabeledInput
                        label="Email:"
                        type="email"
                        placeholder="xxxx@xxx.com"
                        required={false}
                        className={styles.inputGroup}
                        labelClassName={styles.label}
                        inputClassName={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                        {...register("email")}
                    />
                    {errors.email && <div className={styles.fieldError}>{errors.email.message}</div>}
                    <LabeledInput
                        label="Password:"
                        type="password"
                        placeholder="********"
                        required={false}
                        className={styles.inputGroup}
                        labelClassName={styles.label}
                        inputClassName={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                        {...register("password")}
                    />
                    {errors.password && <div className={styles.fieldError}>{errors.password.message}</div>}
                    <div className={styles.buttonGroup}>
                        <button type="submit" disabled={isPending} className={styles.submitButton}>
                            {isPending ? "A entrar..." : "Entrar"}
                        </button>
                        <Link to={"/signup"} className={styles.registerButton}>Registar-me</Link>
                    </div>
                </form>
            </div>
        </section>
    );
}

export default Login;