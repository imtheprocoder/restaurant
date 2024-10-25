import React from 'react'
import { useForm } from 'react-hook-form';
import Title from '../Title/Title';
import Input from '../Input/Input';
import Button from '../Button/Button';
import { useAuth } from '../../hooks/useAuth';

export default function ChangePassword() {
    const {
        handleSubmit,
        register,
        getValues,
        formState: { errors },
    } = useForm();

    const {changePassword} = useAuth();

    const submit = passwords => {
        changePassword(passwords);
    }

  return <div>
    <Title title="Ändra Lösenord" />
    <form onSubmit={handleSubmit(submit)}>
        <Input
            type="password"
            label="Nuvarande Lösenord"
            {...register('currentPassword', { required: true})}
            error={errors.currentPassword}
        />

        <Input
            type="password"
            label="Nytt Lösenord"
            {...register('newPassword', { required: true, minLength: 5 })}
            error={errors.newPassword}
        />

        <Input
            type="password"
            label="Bekräfta Lösenord"
            {...register('confirmNewPassword', { required: true, validate: value => value != getValues('newPassword') ? "Passwords do not match" : true })}
            error={errors.confirmNewPassword}
        />

        <Button type="submit" text="Ändra" />
    </form>
  </div>
}
