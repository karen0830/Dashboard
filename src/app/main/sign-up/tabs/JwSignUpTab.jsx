import { Controller, useForm } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import FormHelperText from '@mui/material/FormHelperText';
import Button from '@mui/material/Button';
import _ from '@lodash';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../../auth/AuthRouteProvider';
import { registerCompanyRequest } from '@mock-api/api/api/auth.company';
import { useState } from 'react';
import "./register.css"
/**
 * Form Validation Schema
 */

const Modal = ({ isOpen, onClose, children }) => {
	if (!isOpen) return null;

	return (
		<div className="modal-overlay">
			<div className="modal-review">
				<div className="modal-content-review">{children}</div>
			</div>
		</div>
	);
};

const schema = z
	.object({
		userNameCompany: z.string().nonempty('Debes ingresar tu nombre'),
		email: z.string().email('Debes ingresar un correo electrónico válido').nonempty('Debes ingresar un correo electrónico'),
		password: z
			.string()
			.nonempty('Por favor ingresa tu contraseña.')
			.min(8, 'La contraseña es demasiado corta - debe tener al menos 8 caracteres.'),
		passwordConfirm: z.string().nonempty('Se requiere la confirmación de la contraseña'),
		acceptTermsConditions: z.boolean().refine((val) => val === true, 'Debes aceptar los términos y condiciones.'),
		phoneNumber: z.string().nonempty('Se requiere el número de teléfono'),
		typeCompany: z.string().nonempty('Se requiere el tipo de empresa')
	})
	.refine((data) => data.password === data.passwordConfirm, {
		message: 'Las contraseñas deben coincidir',
		path: ['passwordConfirm']
	});

const defaultValues = {
	userNameCompany: '',
	email: '',
	password: '',
	passwordConfirm: '',
	acceptTermsConditions: false,
	phoneNumber: '',
	typeCompany: ''
};


function JwtSignUpTab() {
	const { jwtService } = useAuth();
	const { control, formState, handleSubmit, setError } = useForm({
		mode: 'onChange',
		defaultValues,
		resolver: zodResolver(schema)
	});
	const { isValid, dirtyFields, errors } = formState;
	const [errorsB, setErrorsB] = useState(null)
	const [isModalOpen, setIsModalOpen] = useState(false);

	const openModal = () => {
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
	};

	const onSubmit = handleSubmit(async (values) => {
		const { displayName, email, password, phoneNumber, typeCompany } = values;
		values.phoneNumber = parseInt(values.phoneNumber);
		console.log(values)
		try {
			const req = await registerCompanyRequest(values);
			console.log(req);
			if (req.response) {
				const errores = [];
				if (Array.isArray(req.response.data)) {
					req.response.data.forEach(element => {
						errores.push(element);
					});
					setErrorsB(errores);
				}else {
					setErrorsB(req.response.data.message)
				}
				setTimeout(() => setErrorsB(null), 10000);
			}else if (req.data) {
				openModal()
			}
			// return [200, req];
		} catch (error) {
			console.log(error, "error");
			// return [200, {error}]
		}
	})

	return (
		<div>
			<Modal isOpen={isModalOpen} onClose={closeModal}>
				<h2 className="Tile-Review">Registro Exitoso</h2>
				<p className="P-content-Review">Tu registro ha sido exitoso. Gracias por unirte a nosotros.</p>
				<button onClick={closeModal}>Cerrar</button>
			</Modal>
			{errorsB !== null && Array.isArray(errorsB) ? (
				errorsB.map((error, index) => (
					<p className='text-red-500' key={index}>{error}</p>
				))
			) : (
				<p className='text-red-500'>{errorsB}</p>
			)}
			<form
				name="registerForm"
				noValidate
				className="mt-32 flex w-full flex-col justify-center"
				onSubmit={onSubmit}
			>


				<div className='mb-2'>
				</div>

				<Controller
					name="userNameCompany"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							className="mb-24"
							label="usuario de la empresa"
							autoFocus
							type="text"
							error={!!errors.displayName}
							helperText={errors?.displayName?.message}
							variant="outlined"
							required
							fullWidth
						/>
					)}
				/>

				<Controller
					name="typeCompany"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							className="mb-24"
							label="Tipo de empresa"
							type="text"
							error={!!errors.typeCompany}
							helperText={errors?.typeCompany?.message}
							variant="outlined"
							required
							fullWidth
						/>
					)}
				/>

				<Controller
					name="email"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							className="mb-24"
							label="Email"
							type="email"
							error={!!errors.email}
							helperText={errors?.email?.message}
							variant="outlined"
							required
							fullWidth
						/>
					)}
				/>

				<Controller
					name="phoneNumber"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							className="mb-24"
							label="Número de teléfono"
							type="number"
							error={!!errors.phoneNumber}
							helperText={errors?.phoneNumber?.message}
							variant="outlined"
							required
							fullWidth
						/>
					)}
				/>

				<Controller
					name="password"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							className="mb-24"
							label="Password"
							type="password"
							error={!!errors.password}
							helperText={errors?.password?.message}
							variant="outlined"
							required
							fullWidth
						/>
					)}
				/>

				<Controller
					name="passwordConfirm"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							className="mb-24"
							label="Password (Confirm)"
							type="password"
							error={!!errors.passwordConfirm}
							helperText={errors?.passwordConfirm?.message}
							variant="outlined"
							required
							fullWidth
						/>
					)}
				/>

				<Controller
					name="acceptTermsConditions"
					control={control}
					render={({ field }) => (
						<FormControl
							className="items-center"
							error={!!errors.acceptTermsConditions}
						>
							<FormControlLabel
								label="I agree to the Terms of Service and Privacy Policy"
								control={
									<Checkbox
										size="small"
										{...field}
									/>
								}
							/>
							<FormHelperText>{errors?.acceptTermsConditions?.message}</FormHelperText>
						</FormControl>
					)}
				/>

				<Button
					variant="contained"
					color="secondary"
					className="mt-24 w-full"
					aria-label="Register"
					disabled={_.isEmpty(dirtyFields) || !isValid}
					type="submit"
					size="large"
				>
					Create your free account
				</Button>
			</form>
		</div>
	);
}

export default JwtSignUpTab;